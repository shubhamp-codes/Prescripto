import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  // 1. Initialize the standard 'pg' connection pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // 2. Pass the pool into Prisma's PostgreSQL adapter
  const adapter = new PrismaPg(pool);

  // 3. Pass the adapter directly into your custom client
  return new PrismaClient({ adapter });
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
