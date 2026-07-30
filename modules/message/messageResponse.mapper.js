import { MessageType } from "@prisma/client";


const messageResponseMapper = (messageResponse) => {
  return {
    id: messageResponse.id,
    content: messageResponse.output_text,
    type: MessageType.MODEL_OUTPUT,
    };
}

export default messageResponseMapper;