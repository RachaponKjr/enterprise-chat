import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class ListChannelsReq {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'workspace_id must not be blank' })
  workspace_id!: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'category_id must not be blank' })
  category_id?: string;

  @IsInt()
  @Min(0)
  @Max(2_147_483_647) // int32
  page_size: number = 0;

  @IsString()
  page_token: string = '';

  @IsBoolean()
  uncategorized_only: boolean = false;
}
