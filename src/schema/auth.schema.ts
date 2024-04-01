import z from "zod";

export const LoginBody = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, { message: "Phải chứa ít nhất 2 ký tự!" })
      .max(256),
    password: z
      .string()
      .min(6, { message: "Phải chứa ít nhất 6 ký tự!" })
      .max(100),
  })
  .strict();

export const RegisterBody = z
  .object({
    email: z.string().email({ message: "Email không hợp lệ!" }),
    username: z
      .string()
      .trim()
      .min(2, { message: "Phải chứa ít nhất 2 ký tự!" })
      .max(256),
    password: z
      .string()
      .min(6, { message: "Phải chứa ít nhất 6 ký tự!" })
      .max(100),
    confirmPassword: z
      .string()
      .min(6, { message: "Phải chứa ít nhất 6 ký tự!" })
      .max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp!",
        path: ["confirmPassword"],
      });
    }
  });
