import bcrypt from "bcryptjs";
import MemberModel from "../schema/Member.model";
import ErrorLog, { HttpCode, Message } from "../libs/Errors";
import { LoginInput, Member, SignupInput } from "../libs/types/member";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

class AuthService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  /** Yangi foydalanuvchini ro'yxatdan o'tkazish */
  public async signup(input: SignupInput): Promise<Member> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const newMember = await this.memberModel.create({
        memberNick: input.memberNick,
        memberPhone: input.memberPhone,
        memberPassword: hashedPassword,
        memberFullName: input.memberFullName ?? "",
        memberType: input.memberType ?? MemberType.USER,
      });
      const result = newMember.toObject();
      delete (result as any).memberPassword;
      return result as Member;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ErrorLog(HttpCode.CONFLICT, Message.USED_MEMBER_NICK_PHONE);
      }
      throw new ErrorLog(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  /** Login qilish */
  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne({ memberNick: input.memberNick })
      .select("+memberPassword")
      .exec();

    if (!member) {
      throw new ErrorLog(HttpCode.NOT_FOUND, Message.WRONG_PASSWORD);
    }

    if (member.memberStatus === MemberStatus.BLOCK) {
      throw new ErrorLog(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
    if (!isMatch) {
      throw new ErrorLog(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    const result = member.toObject();
    delete (result as any).memberPassword;
    return result as Member;
  }

  /** Sessiyadagi id orqali foydalanuvchini olish */
  public async verifyMember(memberId: string): Promise<Member | null> {
    const member = await this.memberModel.findById(memberId).exec();
    if (!member || member.memberStatus === MemberStatus.BLOCK) return null;
    return member;
  }
}

export default AuthService;
