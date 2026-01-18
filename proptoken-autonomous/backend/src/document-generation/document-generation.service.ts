import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export interface LegalDocument {
    id: string;
    entityId: string;
    type: string;
    url: string;
    hash: string;
    generatedAt: string;
}

@Injectable()
export class DocumentGenerationService {
    private readonly logger = new Logger(DocumentGenerationService.name);
    private documents = new Map<string, LegalDocument[]>();

    async generateDocuments(entityId: string): Promise<LegalDocument[]> {
        this.logger.log(`Generating documents for entity ${entityId}`);

        const docTypes = [
            'OFFERING_MEMORANDUM',
            'TRUST_DEED',
            'SHAREHOLDER_AGREEMENT',
            'SUBSCRIPTION_AGREEMENT'
        ];

        const generatedDocs: LegalDocument[] = docTypes.map(type => {
            const docId = uuidv4();
            const url = `https://cdn.proptoken.com/docs/legal/${type.toLowerCase()}-${docId.slice(0, 8)}.pdf`;
            const hash = crypto.createHash('sha256').update(url).digest('hex');

            return {
                id: docId,
                entityId,
                type,
                url,
                hash,
                generatedAt: new Date().toISOString()
            };
        });

        this.documents.set(entityId, generatedDocs);
        return generatedDocs;
    }

    async getDocuments(entityId: string): Promise<LegalDocument[]> {
        return this.documents.get(entityId) || [];
    }
}
