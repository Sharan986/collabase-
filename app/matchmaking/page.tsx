"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase-context';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getTopMatches, calculateSkillCoverage, getMissingSkills } from '@/lib/match-algorithm';
import { themeClasses, getStateBadgeClass } from '@/lib/theme-utils';
import { cn } from '@/lib/utils';

interface Team {
  id: string;
  name: string;
  creatorId: string;
  skillsNeeded: string[];
  goal: 'win' | 'learn' | 'build';
  timeCommitment: 'full-time' | 'partial';
  state: 'DRAFT' | 'OPEN' | 'FINALIZED' | 'LOCKED';
  members: string[];
  memberDetails?: any[];
  createdAt: number;
}

export default function MatchmakingPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [topMatchIds, setTopMatchIds] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (!loading && userProfile && !userProfile.profileCompleted) {
      router.push('/onboarding');
    }
  }, [user, userProfile, loading, router]);

  useEffect(() => {
    if (!userProfile?.intent) return;

    const fetchTeams = async () => {
      setLoadingTeams(true);
      setTeamsError(null);
      try {
        if (userProfile.intent === 'join') {
          // Fetch teams looking for members (OPEN state)
          const teamsQuery = query(
            collection(db, 'teams'),
            where('state', '==', 'OPEN')
          );
          const snapshot = await getDocs(teamsQuery);
          
          const teamsData: Team[] = [];
          const allMemberIds = new Set<string>();
          
          // First pass: collect all teams and member IDs
          for (const docSnap of snapshot.docs) {
            const teamData = { id: docSnap.id, ...docSnap.data() } as Team;
            teamsData.push(teamData);
            
            // Collect all unique member IDs
            for (const memberId of teamData.members || []) {
              allMemberIds.add(memberId);
            }
          }
          
          // Batch fetch all member details (max 10 per query due to Firestore 'in' limit)
          const memberIdsArray = Array.from(allMemberIds);
          const membersMap = new Map<string, any>();
          
          for (let i = 0; i < memberIdsArray.length; i += 10) {
            const batch = memberIdsArray.slice(i, i + 10);
            if (batch.length > 0) {
              const membersQuery = query(
                collection(db, 'users'),
                where(documentId(), 'in', batch)
              );
              const membersSnapshot = await getDocs(membersQuery);
              membersSnapshot.forEach((memberDoc) => {
                membersMap.set(memberDoc.id, memberDoc.data());
              });
            }
          }
          
          // Second pass: populate member details from map
          for (const teamData of teamsData) {
            const memberDetails = [];
            for (const memberId of teamData.members || []) {
              const memberData = membersMap.get(memberId);
              if (memberData) {
                memberDetails.push(memberData);
              }
            }
            teamData.memberDetails = memberDetails;
          }
          
          setTeams(teamsData);

          // Calculate top matches
          if (userProfile.primarySkills && userProfile.secondarySkills) {
            const matches = getTopMatches(
              userProfile.primarySkills,
              userProfile.secondarySkills,
              teamsData,
              3
            );
            setTopMatchIds(matches.map(m => m.teamId));
          }
        } else if (userProfile.intent === 'create') {
          // For creators, show potential team members (users looking to join)
          // This will be implemented when we add the create team flow
          // For now, just show empty state
          setTeams([]);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeamsError('Failed to load teams. Please try again.');
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [userProfile]);

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-pixel text-2xl">Loading...</div>
      </div>
    );
  }

  const handleCreateTeam = () => {
    router.push('/matchmaking/create-team');
  };

  return (
    <div className="relative min-h-screen w-full pt-20">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 opacity-20 bg-gradient-to-br from-white via-gray-50 to-gray-100" />

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="mb-6">
              <h1 className={cn(themeClasses.headingPixel, 'text-4xl sm:text-5xl mb-2')}>
                {userProfile.intent === 'join' ? 'FIND TEAM' : 'BUILD TEAM'}
              </h1>
              <p className="font-sans text-lg text-black/60">
                {userProfile.intent === 'join' 
                  ? 'Browse teams looking for members' 
                  : 'Create your team and find the right members'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - User Info */}
            <div className="lg:col-span-1">
              <div className={cn(themeClasses.card, 'p-6 sticky top-6')}>
                <p className={themeClasses.textMono}>Your Profile</p>
                <h3 className="font-display text-xl font-bold mt-3 mb-4">
                  {userProfile.displayName}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className={cn(themeClasses.textMono, 'mb-2')}>Intent</p>
                    <span className={cn(themeClasses.badge, themeClasses.badgePrimary, 'uppercase')}>
                      {userProfile.intent}
                    </span>
                  </div>

                  <div>
                    <p className={cn(themeClasses.textMono, 'mb-2')}>Primary Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.primarySkills?.map((skill) => (
                        <span key={skill} className={cn(themeClasses.badge, themeClasses.badgeSecondary)}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className={cn(themeClasses.textMono, 'mb-2')}>Role</p>
                    <p className="font-sans capitalize">{userProfile.role}</p>
                  </div>
                </div>

                {/* Support */}
                <div className="mt-6 pt-6 border-t border-black/10">
                  <p className="font-mono text-[0.625rem] text-black/30">
                    Need help?{' '}
                    <a 
                      href="mailto:collabase.app@gmail.com" 
                      className="text-black/50 hover:text-black transition-colors underline underline-offset-2"
                    >
                      collabase.app@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {userProfile.intent === 'create' && (
                <div className={cn(themeClasses.card, 'p-12 text-center mb-8')}>
                  <h2 className={cn(themeClasses.headingPixel, 'text-3xl mb-4')}>
                    CREATE YOUR TEAM
                  </h2>
                  <p className="font-sans text-lg text-black/60 mb-8">
                    Start building your dream hackathon team
                  </p>
                  <button onClick={handleCreateTeam} className={themeClasses.buttonPrimary}>
                    Create Team →
                  </button>
                </div>
              )}

              {userProfile.intent === 'join' && (
                <>
                  {loadingTeams ? (
                    <div className="text-center py-12">
                      <p className="font-mono text-black/40">Loading teams...</p>
                    </div>
                  ) : teamsError ? (
                    <div className={cn(themeClasses.card, 'p-12 text-center')}>
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className={cn(themeClasses.headingPixel, 'text-2xl mb-4')}>
                        OOPS!
                      </h3>
                      <p className="font-sans text-black/60 mb-6">
                        {teamsError}
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className={themeClasses.buttonPrimary}
                      >
                        Retry
                      </button>
                    </div>
                  ) : teams.length === 0 ? (
                    <div className={cn(themeClasses.card, 'p-12 text-center')}>
                      <h3 className={cn(themeClasses.headingPixel, 'text-2xl mb-4')}>
                        NO TEAMS YET
                      </h3>
                      <p className="font-sans text-black/60">
                        Be the first to create a team or check back later
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {teams.map((team) => {
                        const isTopMatch = topMatchIds.includes(team.id);
                        const memberSkills = team.memberDetails?.map(m => m.primarySkills || []) || [];
                        const coverage = calculateSkillCoverage(team.skillsNeeded, memberSkills);
                        const missingSkills = getMissingSkills(team.skillsNeeded, memberSkills);

                        return (
                          <div
                            key={team.id}
                            className={cn(
                              themeClasses.card,
                              themeClasses.cardHover,
                              'p-8 relative'
                            )}
                          >
                            {isTopMatch && (
                              <div className="absolute -top-3 -right-3 bg-black text-white px-4 py-2 rounded-full font-pixel text-xs">
                                TOP MATCH
                              </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-display text-2xl font-bold mb-2">
                                  {team.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={getStateBadgeClass(team.state)}>
                                    {team.state}
                                  </span>
                                  <span className={cn(themeClasses.badge, themeClasses.badgeSecondary)}>
                                    {team.members?.length || 0}/5 members
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Skill Coverage Bar */}
                            <div className="mb-6">
                              <div className="flex items-center justify-between mb-2">
                                <p className={themeClasses.textMono}>Skill Coverage</p>
                                <p className="font-mono text-sm font-bold">{coverage}%</p>
                              </div>
                              <div className="h-3 bg-black/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-black transition-all"
                                  style={{ width: `${coverage}%` }}
                                />
                              </div>
                            </div>

                            {/* Missing Skills */}
                            {missingSkills.length > 0 && (
                              <div className="mb-6">
                                <p className={cn(themeClasses.textMono, 'mb-2')}>Missing Skills</p>
                                <div className="flex flex-wrap gap-2">
                                  {missingSkills.map((skill) => (
                                    <span
                                      key={skill}
                                      className="px-3 py-1 rounded-full text-sm font-sans bg-red-100 text-red-700 border border-red-200"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Skills Needed */}
                            <div className="mb-6">
                              <p className={cn(themeClasses.textMono, 'mb-2')}>Skills Needed</p>
                              <div className="flex flex-wrap gap-2">
                                {team.skillsNeeded?.map((skill: string) => (
                                  <span key={skill} className={cn(themeClasses.badge, themeClasses.badgeSecondary)}>
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Current Members */}
                            <div className="mb-6">
                              <p className={cn(themeClasses.textMono, 'mb-2')}>Current Members</p>
                              <div className="space-y-2">
                                {team.memberDetails?.map((member, idx) => (
                                  <div key={idx} className={cn(themeClasses.cardInner, 'p-3')}>
                                    <p className="font-sans font-semibold text-sm">{member.displayName}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {member.primarySkills?.map((skill: string) => (
                                        <span key={skill} className="text-xs px-2 py-0.5 bg-black/10 rounded">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={() => router.push(`/matchmaking/team/${team.id}`)}
                              className={themeClasses.buttonPrimary}
                            >
                              View Team →
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
