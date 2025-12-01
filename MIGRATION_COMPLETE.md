# التحويل من Firebase إلى Supabase - دليل سريع

## ✅ تم التحويل بنجاح!

تم تحويل جميع أجزاء التطبيق من Firebase إلى Supabase:

### الملفات المحولة:

1. **lib/auth.ts** ✅
   - تم تحويل نظام المصادقة بالكامل
   - تسجيل الدخول والخروج
   - التسجيل كمستخدم مجهول

2. **lib/firestore.ts** ✅
   - تحويل قاعدة البيانات من Firestore إلى Supabase Postgres
   - الرسائل والمحادثات
   - مؤشرات الكتابة
   - الاشتراكات في الوقت الفعلي

3. **lib/storage.ts** ✅
   - تحويل التخزين من Firebase Storage إلى Supabase Storage
   - رفع الصور

4. **lib/users.ts** ✅
   - إدارة المستخدمين
   - حالة الاتصال (Online/Offline)
   - الاشتراكات في الوقت الفعلي

5. **contexts/AuthContext.tsx** ✅
   - تحويل سياق المصادقة
   - تتبع حالة المستخدم

6. **lib/supabase.ts** ✅ (جديد)
   - إعداد عميل Supabase

7. **supabase-schema.sql** ✅ (جديد)
   - مخطط قاعدة البيانات الكامل
   - جداول: users, conversations, messages, typing_indicators
   - سياسات الأمان (RLS)
   - Storage bucket للصور

### الملفات المحذوفة:

- **lib/firebase.ts** ❌ (تم الحذف)

## 🚀 الخطوات التالية:

### 1. افتح ملف `.env.local` وعدّل القيم:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. أنشئ مشروع Supabase:

اتبع التعليمات في ملف **SUPABASE_SETUP.md**

### 3. شغّل التطبيق:

```bash
npm run dev
```

## 📊 التغييرات الرئيسية:

### أسماء الحقول:
- `uid` → `id`
- `displayName` → `display_name`
- `avatarUrl` → `avatar_url`
- `lastSeen` → `last_seen`
- `isAnonymous` → `is_anonymous`
- `createdAt` → `created_at`
- `senderId` → `sender_id`
- `conversationId` → `conversation_id`
- `imageUrl` → `image_url`
- `lastMessage` → `last_message`
- `lastMessageTime` → `last_message_time`
- `updatedAt` → `updated_at`

### التواريخ:
- Firebase `Timestamp` → ISO String (`string`)
- Firebase `serverTimestamp()` → `new Date().toISOString()`

### الوقت الفعلي:
- Firebase `onSnapshot()` → Supabase `channel().on('postgres_changes')`

### التخزين:
- Firebase Storage → Supabase Storage bucket (`chat-images`)

## 🔧 الاختلافات المهمة:

### 1. المصادقة:
```typescript
// قبل (Firebase)
auth.createUserWithEmailAndPassword(email, password)

// بعد (Supabase)
supabase.auth.signUp({ email, password })
```

### 2. قاعدة البيانات:
```typescript
// قبل (Firebase)
addDoc(collection(db, 'messages'), {...})

// بعد (Supabase)
supabase.from('messages').insert({...})
```

### 3. الوقت الفعلي:
```typescript
// قبل (Firebase)
onSnapshot(query, (snapshot) => {...})

// بعد (Supabase)
supabase
  .channel('messages')
  .on('postgres_changes', {...})
  .subscribe()
```

## 💰 لماذا Supabase؟

- ✅ **مجاني تمامًا** للمشاريع الصغيرة والمتوسطة
- ✅ 500 MB قاعدة بيانات
- ✅ 1 GB تخزين ملفات
- ✅ Realtime غير محدود
- ✅ 50,000 مستخدم نشط شهريًا
- ✅ PostgreSQL قوي وموثوق
- ✅ واجهة سهلة الاستخدام

## ⚠️ ملاحظات مهمة:

1. **يجب تشغيل SQL Schema**: قبل استخدام التطبيق، شغّل محتوى ملف `supabase-schema.sql` في Supabase SQL Editor

2. **تفعيل Realtime**: فعّل Realtime لكل الجداول من Database > Replication

3. **Storage Bucket**: تم إنشاؤه تلقائيًا عبر SQL (`chat-images`)

4. **RLS مفعّل**: جميع الجداول محمية بـ Row Level Security

## 📚 المراجع:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [PostgreSQL vs Firestore](https://supabase.com/docs/guides/database/postgres-vs-firestore)

## ✅ جاهز للاستخدام!

بعد إعداد Supabase، التطبيق جاهز بالكامل بنفس الميزات:
- ✅ الدردشة الفورية
- ✅ رفع الصور
- ✅ مؤشرات الكتابة
- ✅ حالة الاتصال (Online/Offline)
- ✅ قائمة المستخدمين
- ✅ التسجيل والدخول
