import { Gender, Prisma, UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';
import config from "../config";
import prisma from "../shared/prisma";

const superAdminData: Prisma.UserCreateInput = {
    name: 'Md. Mehedi Hasan Mehad',
    profilePhoto: 'https://res.cloudinary.com/dxbpbbpbh/image/upload/v1748803881/photo_2024-08-15_01-36-46-1748803881699-988306660.jpg',
    email: config.myInfo.my_email!,
    password: config.myInfo.my_password!,

    contactNumber: config.myInfo.my_number!,

    role: UserRole.ADMIN,

    aboutMe:
        'Full Stack Developer specializing in scalable web applications using Node.js, Express, Next.js, Prisma, and PostgreSQL. Passionate about clean architecture and production-grade systems.',

    designation: 'Full Stack Developer',

    projectCount: 0,
    blogCount: 0,
    skillCount: 0,

    socialMediaLinks: [
        'https://github.com/yourusername',
        'https://linkedin.com/in/yourusername',
        'https://twitter.com/yourusername',
        'https://mehedimehadportfolio.vercel.app'
    ],

    gender: Gender.Male,

    needPasswordChange: false,

    address: 'Dhaka, Bangladesh',
};

const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await prisma.user.findFirst({
            where: {
                role: UserRole.ADMIN,
            },
        });

        if (isSuperAdminExists) {
            console.log('⚠️  Super Admin already exists.');
            return;
        }


        const hashedPassword = await bcrypt.hash(superAdminData.password, 12);

        await prisma.user.create({
            data: {
                ...superAdminData,
                password: hashedPassword,
            },
        });

        console.log('✅ Super Admin created successfully.');
    } catch (error) {
        console.error('❌ Error seeding Super Admin:', error);
    }
};

export default seedSuperAdmin;