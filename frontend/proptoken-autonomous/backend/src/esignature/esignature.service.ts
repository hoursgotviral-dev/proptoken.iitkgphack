import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface SignatureEnvelope {
    id: string;
    documentId: string;
    signers: string[];
    status: 'SENT' | 'DELIVERED' | 'COMPLETED' | 'DECLINED';
    completedAt?: string;
}

@Injectable()
export class ESignatureService {
    private readonly logger = new Logger(ESignatureService.name);
    private envelopes = new Map<string, SignatureEnvelope>();

    async sendForSignature(documentId: string, signers: string[]): Promise<SignatureEnvelope> {
        this.logger.log(`Sending document ${documentId} for signature to ${signers.join(', ')}`);

        const envelopeId = uuidv4();
        const envelope: SignatureEnvelope = {
            id: envelopeId,
            documentId,
            signers,
            status: 'SENT'
        };

        this.envelopes.set(envelopeId, envelope);

        // Auto-complete mock signature after a short internal delay (simulated via status check)
        return envelope;
    }

    async checkStatus(envelopeId: string): Promise<string> {
        const envelope = this.envelopes.get(envelopeId);
        if (envelope && envelope.status === 'SENT') {
            envelope.status = 'COMPLETED';
            envelope.completedAt = new Date().toISOString();
            this.envelopes.set(envelopeId, envelope);
        }
        return envelope?.status || 'NOT_FOUND';
    }
}
