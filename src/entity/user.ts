import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import { Note } from "./note";
import { Folder } from "./folder";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable: true})
  photoUrl: string;

  @Column()
  password: string;

  @Index()
  @Column({
    unique: true,
    nullable: true,
  })
  firebaseUuid: string;

  @Column({ default: "" })
  confirmationToken: string;

  @Column({ default: "" })
  resetCode: string;

  @OneToMany(() => Note, (note) => note.owner) notes: Note[];

  @OneToMany(() => Folder, (folder) => folder.owner) folders: Folder[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
