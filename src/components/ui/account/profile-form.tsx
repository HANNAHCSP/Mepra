// src/components/ui/account/profile-form.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { updateNameAction, updatePasswordAction } from '@/app/actions/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
  };
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Saving...' : text}
    </Button>
  );
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [nameState, nameFormAction] = useActionState(updateNameAction, { success: false, message: '' });
  const [passwordState, passwordFormAction] = useActionState(updatePasswordAction, { success: false, message: '' });
  
  const passwordFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (nameState.message) {
      if (nameState.success) {
        toast.success(nameState.message);
      } else {
        toast.error(nameState.message);
      }
    }
  }, [nameState]);

  useEffect(() => {
    if (passwordState.message) {
      if (passwordState.success) {
        toast.success(passwordState.message);
        passwordFormRef.current?.reset();
      } else {
        toast.error(passwordState.message);
      }
    }
  }, [passwordState]);

  return (
    <div className="space-y-8">
      {/* Update Name Form */}
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
        <p className="text-sm text-gray-500 mt-1">Update your name and email address.</p>
        <form action={nameFormAction} className="mt-4 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input id="email" type="email" value={user.email ?? ''} disabled className="mt-1 bg-gray-100" />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <Input id="name" name="name" type="text" defaultValue={user.name ?? ''} required className="mt-1" />
          </div>
          <div className="text-right">
            <SubmitButton text="Update Name" />
          </div>
        </form>
      </div>

      {/* Update Password Form */}
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
        <p className="text-sm text-gray-500 mt-1">Choose a new password for your account.</p>
        <form ref={passwordFormRef} action={passwordFormAction} className="mt-4 space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <Input id="newPassword" name="newPassword" type="password" required className="mt-1" />
          </div>
           <div className="text-right">
            <SubmitButton text="Update Password" />
          </div>
        </form>
      </div>
    </div>
  );
}