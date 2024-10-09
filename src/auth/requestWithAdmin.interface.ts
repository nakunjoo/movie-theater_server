import { Request } from 'express';

interface RequestWithAdmin extends Request {
  user: string;
}
export default RequestWithAdmin;
