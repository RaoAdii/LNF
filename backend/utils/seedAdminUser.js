const User = require('../models/User');

const DEFAULT_ADMIN_NAME = 'Test Admin';
const DEFAULT_ADMIN_EMAIL = 'admin@lnf.local';
const DEFAULT_ADMIN_PASSWORD = 'Admin@123456';

const normalizeBoolean = (value) => String(value || '').toLowerCase() === 'true';

const resolveAdminSeedConfig = () => {
  const name = String(process.env.ADMIN_TEST_NAME || DEFAULT_ADMIN_NAME).trim();
  const email = String(process.env.ADMIN_TEST_EMAIL || DEFAULT_ADMIN_EMAIL)
    .toLowerCase()
    .trim();
  const password = String(process.env.ADMIN_TEST_PASSWORD || DEFAULT_ADMIN_PASSWORD);

  const isProduction = process.env.NODE_ENV === 'production';
  const shouldResetPasswordOnBoot =
    normalizeBoolean(process.env.ADMIN_RESET_PASSWORD_ON_BOOT) ||
    (!isProduction && !process.env.ADMIN_TEST_PASSWORD);

  return {
    name,
    email,
    password,
    shouldResetPasswordOnBoot,
  };
};

const seedDefaultAdmin = async () => {
  const { name, email, password, shouldResetPasswordOnBoot } = resolveAdminSeedConfig();

  if (!email || !password) {
    console.warn('[admin-seed] skipped: missing email or password');
    return null;
  }

  const existingAdmin = await User.findOne({ email }).select('+password');

  if (!existingAdmin) {
    const created = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isVerified: true,
      isBanned: false,
    });

    console.log(`[admin-seed] created test admin account for ${email}`);
    return created;
  }

  let shouldSave = false;

  if (existingAdmin.role !== 'admin') {
    existingAdmin.role = 'admin';
    shouldSave = true;
  }

  if (existingAdmin.isBanned) {
    existingAdmin.isBanned = false;
    shouldSave = true;
  }

  if (!existingAdmin.isVerified) {
    existingAdmin.isVerified = true;
    shouldSave = true;
  }

  if (shouldResetPasswordOnBoot) {
    existingAdmin.password = password;
    shouldSave = true;
  }

  if (shouldSave) {
    await existingAdmin.save();
    console.log(`[admin-seed] synced test admin account for ${email}`);
  } else {
    console.log(`[admin-seed] test admin account already ready for ${email}`);
  }

  return existingAdmin;
};

module.exports = {
  seedDefaultAdmin,
};
