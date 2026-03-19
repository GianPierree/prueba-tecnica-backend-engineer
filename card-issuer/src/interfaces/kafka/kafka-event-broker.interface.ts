export interface IKafkaEventBroker {
  connect(): Promise<void>;
  publish(topic: string, payload: any): Promise<void>;
  disconnect(): Promise<void>;
}