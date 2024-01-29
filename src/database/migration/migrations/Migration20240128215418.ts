import { Migration } from '@mikro-orm/migrations';

export class Migration20240128215418 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `chapter` (`id` bigint unsigned not null auto_increment primary key, `title` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
    );

    this.addSql(
      'create table `post` (`id` bigint unsigned not null auto_increment primary key, `position` varchar(255) not null, `text` mediumtext not null, `chapter_id` bigint unsigned not null, `timestamp` timestamp not null, `year` year null, `role_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `post` add index `post_position_index`(`position`);',
    );
    this.addSql(
      'alter table `post` add index `post_chapter_id_index`(`chapter_id`);',
    );

    this.addSql(
      'alter table `post` add constraint `post_chapter_id_foreign` foreign key (`chapter_id`) references `chapter` (`id`) on update cascade on delete cascade;',
    );
  }
}
