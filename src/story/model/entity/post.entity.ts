import {
  BeforeCreate,
  BeforeUpdate,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Chapter } from './chapter.entity';

export class Post {
  @PrimaryKey({
    name: 'id',
    columnType: 'bigint',
    autoincrement: true,
  })
  id!: number;

  @Property({
    name: 'position',
    columnType: 'varchar(255)',
    nullable: false,
    index: true,
  })
  position!: string;

  @Property({
    name: 'text',
    columnType: 'mediumtext',
    nullable: false,
  })
  text!: string;

  @ManyToOne({
    entity: () => Chapter,
    nullable: false,
    joinColumn: 'chapter_id',
    columnType: 'bigint',
  })
  chapter!: Chapter;

  @Property({
    name: 'timestamp',
    columnType: 'timestamp',
    nullable: false,
  })
  lastUpdate: Date;

  @Property({
    name: 'year',
    columnType: 'year',
    nullable: false,
  })
  year!: number;

  @Property({
    name: 'role_name',
    columnType: 'varchar(255)',
    nullable: true,
  })
  roleName!: string;

  @BeforeUpdate()
  async updateTimestamp(): Promise<void> {
    this.lastUpdate = new Date();
  }

  @BeforeCreate()
  async createTimestamp(): Promise<void> {
    this.lastUpdate = new Date();
  }
}
