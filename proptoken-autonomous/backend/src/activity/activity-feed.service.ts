import { Injectable, Logger } from '@nestjs/common';
import { TokenMintingResult } from '../minting/token-minter.service';
import { SubmissionResult } from '../submission/submission.service';

export interface ActivityFeedEvent {
  id: string;
  type: 'SPV_SUBMITTED' | 'SPV_VERIFIED' | 'SPV_FAILED' | 'TOKEN_MINTED' | 'TOKEN_DEPLOYED' | 'TRADE_EXECUTED';
  timestamp: number;
  actor: string; // wallet address or system
  assetName: string;
  details: Record<string, any>;
  txHash?: string;
  explorerUrl?: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  message: string;
}

@Injectable()
export class ActivityFeedService {
  private readonly logger = new Logger(ActivityFeedService.name);
  private activities: ActivityFeedEvent[] = [];
  private readonly MAX_ACTIVITIES = 1000; // Keep last 1000 events

  /**
   * Log SPV submission event
   */
  logSubmissionEvent(submission: SubmissionResult): void {
    const event: ActivityFeedEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      type: 'SPV_SUBMITTED',
      timestamp: Date.now(),
      actor: 'SYSTEM',
      assetName: submission.spv.name,
      details: {
        submissionId: submission.submissionId,
        address: submission.spv.address,
        coordinates: {
          latitude: submission.spv.latitude,
          longitude: submission.spv.longitude
        },
        satImageUrl: submission.spv.satImageUrl
      },
      status: 'CONFIRMED',
      message: `📋 SPV "${submission.spv.name}" submitted for verification from (${submission.spv.latitude}, ${submission.spv.longitude})`
    };

    this.addActivity(event);
    this.logger.log(`[Activity] ${event.message}`);
  }

  /**
   * Log SPV verification result
   */
  logVerificationEvent(submission: SubmissionResult): void {
    const event: ActivityFeedEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      type: submission.passed ? 'SPV_VERIFIED' : 'SPV_FAILED',
      timestamp: Date.now(),
      actor: 'ABM_ENGINE',
      assetName: submission.spv.name,
      details: {
        submissionId: submission.submissionId,
        abmScore: submission.abmScore.overallScore,
        locationConsistency: submission.abmScore.locationConsistency,
        satelliteConfidence: submission.abmScore.satelliteConfidence,
        registryMatch: submission.abmScore.registryMatch,
        assetFingerprint: submission.assetFingerprint,
        reasoning: submission.abmScore.reasoning
      },
      status: submission.passed ? 'CONFIRMED' : 'FAILED',
      message: submission.abmScore.reasoning
    };

    this.addActivity(event);
    this.logger.log(`[Activity] ${event.message}`);
  }

  /**
   * Log token minting event
   */
  logTokenMintingEvent(submission: SubmissionResult, minting: TokenMintingResult): void {
    const event: ActivityFeedEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      type: 'TOKEN_MINTED',
      timestamp: minting.timestamp,
      actor: 'TOKEN_FACTORY',
      assetName: submission.spv.name,
      details: {
        tokenName: minting.tokenName,
        tokenAddress: minting.tokenAddress,
        initialSupply: minting.totalSupply,
        submissionId: submission.submissionId,
        assetFingerprint: submission.assetFingerprint
      },
      txHash: minting.transactionHash,
      explorerUrl: minting.explorerUrl,
      status: minting.status === 'FAILED' ? 'FAILED' : 'PENDING',
      message: `⚜ Token "${minting.tokenName}" minting initiated. Supply: ${minting.totalSupply} tokens. Status: ${minting.status}`
    };

    this.addActivity(event);
    this.logger.log(`[Activity] ${event.message}`);
  }

  /**
   * Log token deployment confirmation (when TX is mined)
   */
  logTokenDeploymentConfirmed(minting: TokenMintingResult): void {
    const event: ActivityFeedEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      type: 'TOKEN_DEPLOYED',
      timestamp: Date.now(),
      actor: 'SEPOLIA_BLOCKCHAIN',
      assetName: minting.tokenName,
      details: {
        tokenAddress: minting.tokenAddress,
        transactionHash: minting.transactionHash,
        blockNumber: minting.blockNumber,
        gasUsed: 'N/A', // Would be available if we track TX receipt
        totalSupply: minting.totalSupply
      },
      txHash: minting.transactionHash,
      explorerUrl: minting.explorerUrl,
      status: 'CONFIRMED',
      message: `✅ Token "${minting.tokenName}" successfully deployed on Sepolia. Explorer: ${minting.explorerUrl}`
    };

    this.addActivity(event);
    this.logger.log(`[Activity] ${event.message}`);
  }

  /**
   * Get full activity feed (paginated)
   */
  getActivityFeed(limit: number = 50, offset: number = 0): {
    events: ActivityFeedEvent[];
    total: number;
    hasMore: boolean;
  } {
    const sorted = this.activities.sort((a, b) => b.timestamp - a.timestamp);
    const paginated = sorted.slice(offset, offset + limit);

    return {
      events: paginated,
      total: this.activities.length,
      hasMore: offset + limit < this.activities.length
    };
  }

  /**
   * Filter activity by type
   */
  getActivityByType(
    type: ActivityFeedEvent['type'],
    limit: number = 50
  ): ActivityFeedEvent[] {
    return this.activities
      .filter(a => a.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get all events for a specific asset
   */
  getAssetTimeline(assetName: string): ActivityFeedEvent[] {
    return this.activities
      .filter(a => a.assetName === assetName)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get dashboard summary
   */
  getDashboardSummary(): {
    totalSubmissions: number;
    verifiedCount: number;
    failedCount: number;
    tokensMinted: number;
    recentEvents: ActivityFeedEvent[];
  } {
    return {
      totalSubmissions: this.getActivityByType('SPV_SUBMITTED').length,
      verifiedCount: this.getActivityByType('SPV_VERIFIED').length,
      failedCount: this.getActivityByType('SPV_FAILED').length,
      tokensMinted: this.getActivityByType('TOKEN_MINTED').length,
      recentEvents: this.activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)
    };
  }

  /**
   * Clear all activities (for testing)
   */
  clearActivities(): void {
    this.activities = [];
    this.logger.log('[Activity] Activity feed cleared');
  }

  /**
   * Internal: Add activity and enforce size limit
   */
  private addActivity(event: ActivityFeedEvent): void {
    this.activities.push(event);

    // Enforce max size
    if (this.activities.length > this.MAX_ACTIVITIES) {
      this.activities = this.activities.slice(-this.MAX_ACTIVITIES);
    }
  }

  /**
   * Export activities as JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.activities, null, 2);
  }
}
