import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

@InputType()
export class ContactInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message!: string;

  /** Base64-encoded file content (max ~13.7 MB encoded ≈ 10 MB raw). */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(14_000_000) // ~10 MB raw → ~13.7 MB base64
  attachmentBase64?: string;

  /** Original filename, e.g. "cv-john.pdf". */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  attachmentName?: string;

  /** MIME type, e.g. "application/pdf". Only common types allowed. */
  @Field({ nullable: true })
  @IsOptional()
  @Matches(
    /^(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.\S+)|image\/(png|jpeg|webp))$/,
  )
  attachmentType?: string;
}
