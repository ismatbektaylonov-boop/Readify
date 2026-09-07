import { Document, Types } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.enum";

export interface Member extends Document {
  _id: Types.ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberFullName?: string;
  memberImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface SignupInput {
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberFullName?: string;
  memberType?: MemberType;
}
