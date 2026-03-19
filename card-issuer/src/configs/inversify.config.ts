import 'reflect-metadata';
import { Container } from 'inversify';

import { TYPES } from '../types';
import { CardIssueController } from '../controllers/cards/card-issue.controller';
import { CardIssueService } from '../services/cards/card-issue.service';
import { CardIssueRepository } from '../repositories/cards/card-issue.repository';
import { 
  ICardIssueRepository, 
  ICardIssueService 
} from '../interfaces/cards/card-issue.interface';
import { IKafkaEventBroker } from '../interfaces/kafka/kafka-event-broker.interface';
import { KafkaEventBrokerProvider } from '../providers/kafka/kafka-event-broker.provider';

const container = new Container();

container.bind<ICardIssueRepository>(TYPES.CardIssueRepository).to(CardIssueRepository).inSingletonScope();
container.bind<ICardIssueService>(TYPES.CardIssueService).to(CardIssueService).inSingletonScope();
container.bind<CardIssueController>(TYPES.CardIssueController).to(CardIssueController).inSingletonScope();
container.bind<IKafkaEventBroker>(TYPES.KafkaEventBrokerProvider).toDynamicValue(() => {
  return new KafkaEventBrokerProvider();
}).inSingletonScope();

export { container };