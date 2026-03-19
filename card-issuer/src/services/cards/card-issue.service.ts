import { inject, injectable } from 'inversify';
import pino from 'pino';

import { TYPES } from '../../types';
import {
  ICardIssue,
  ICardIssueRepository,
  ICardIssueService,
} from '../../interfaces/cards/card-issue.interface';
import { IKafkaEventBroker } from '../../interfaces/kafka/kafka-event-broker.interface';
import { KAFKA_TOPICS } from '../../shared/constants';

@injectable()
export class CardIssueService implements ICardIssueService {
  private logger = pino({
    name: CardIssueService.name,
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
      },
    },
  });

  constructor(
    @inject(TYPES.CardIssueRepository) private readonly cardIssueRepository: ICardIssueRepository,
    @inject(TYPES.KafkaEventBrokerProvider) private readonly kafkaEventBrokerProvider: IKafkaEventBroker,
  ) {}

  async create(cardIssue: Omit<ICardIssue, 'id'>): Promise<Pick<ICardIssue, 'id' | 'status'>> {
    try {
      const result = await this.cardIssueRepository.save(cardIssue);
      this.logger.info(`Card issue created successfully: ${result.id}`);

      if (result) {
        const payload = {
          id: 1,
          source: crypto.randomUUID(),
          data: {
            cardId: result.id,
            status: result.status,
          },
          type: KAFKA_TOPICS.CARD_REQUESTED,
          date: new Date().toISOString(),
        };
        this.kafkaEventBrokerProvider.publish(KAFKA_TOPICS.CARD_REQUESTED, payload);
      }

      return {
        id: result.id,
        status: result.status,
      };
    } catch (error) {
      this.logger.error(`Error creating card issue: ${(error as Error).message}`);
      throw error;
    }
  }
}
