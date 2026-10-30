const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUser = (body: any) => {
  const errors: string[] = [];
  const { email, password, name } = body;

  if (!email) {
    errors.push('Email wajib diisi');
  } else if (!emailRegex.test(email)) {
    errors.push('Format email tidak valid');
  }

  if (!password) {
    errors.push('Password wajib diisi');
  } else if (String(password).length < 8) {
    errors.push('Password minimal 8 karakter');
  }

  if (name !== undefined && String(name).trim() === '') {
    errors.push('Nama tidak boleh kosong');
  }

  return errors;
};

export const validatePosts = (posts: any) => {
  const errors: string[] = [];

  if (!Array.isArray(posts)) {
    errors.push('Body harus berupa array');
    return errors;
  }

  if (posts.length === 0) {
    errors.push('Array post tidak boleh kosong');
    return errors;
  }

  posts.forEach((post, i) => {
    if (!post.title || String(post.title).trim() === '') {
      errors.push(`Post ke-${i + 1}: title wajib diisi`);
    }
    if (!post.authorId || isNaN(Number(post.authorId))) {
      errors.push(`Post ke-${i + 1}: authorId wajib diisi dan harus angka`);
    }
  });

  return errors;
};