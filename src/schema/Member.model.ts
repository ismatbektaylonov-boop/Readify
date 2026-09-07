import { Schema, model } from "mongoose";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import { Member } from "../libs/types/member";

const memberSchema = new Schema<Member>(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },
    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },
    memberNick: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    memberPhone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    memberPassword: {
      type: String,
      required: true,
      select: false,
    },
    memberFullName: {
      type: String,
      default: "",
    },
    memberImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "members",
  }
);

export default model<Member>("Member", memberSchema);
