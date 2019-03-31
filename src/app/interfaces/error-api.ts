export interface ErrorApi extends Error {
    error: APIMessage;
}
  
interface APIMessage {
    message: string;
}