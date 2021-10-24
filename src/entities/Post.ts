import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import { BeforeInsert, Column, Entity as TOEntity, Index } from "typeorm";
import Entity from "./Entity";

@TOEntity("posts")
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }
}
