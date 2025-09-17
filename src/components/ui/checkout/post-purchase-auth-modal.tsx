'use client';

import { useEffect, useState } from 'react'; // Import useState
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, User, Mail, X } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createAccountFromGuestOrder } from '@/app/actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// ... (FormSchema and SubmitButton remain the same)
const FormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  orderId: z.string(),
});
type FormData = z.infer<typeof FormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Creating Account...' : 'Create Account & Save Order'}
    </Button>
  );
}


interface PostPurchaseAuthModalProps {
  orderId: string;
  customerEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostPurchaseAuthModal({
  orderId,
  customerEmail,
  isOpen,
  onClose,
}: PostPurchaseAuthModalProps) {
  const [state, formAction] = useActionState(createAccountFromGuestOrder, {
    success: false,
    message: '',
  });

  // --- FIX START ---
  // 1. Create a state variable to hold the password
  const [password, setPassword] = useState('');
  // --- FIX END ---
  
  const { register, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      
      // --- FIX START ---
      // 2. Use the password from the state variable for the signIn call
      if (password) {
        signIn('credentials', {
          email: customerEmail,
          password: password, // Use the state variable here
          redirect: false,
        }).then((result) => {
          if (result?.ok) {
            router.refresh(); 
            router.push('/account/orders');
          } else {
            toast.error('Login failed after registration. Please try logging in manually.');
            router.push('/signin');
          }
        });
      } else {
         toast.error('Could not log you in automatically. Please sign in.');
         router.push('/signin');
      }
      // --- FIX END ---

    } else if (state.message && state.message !== 'Invalid form data.') {
      toast.error(state.message);
    }
  }, [state, customerEmail, router, password]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h3 className="text-xl font-semibold text-gray-900">Create an account</h3>
        <p className="mt-2 text-sm text-gray-600">
          Save this order to your account for easy tracking and faster checkouts next time.
        </p>
        
        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="orderId" value={orderId} />
          {/* ... (Email and Name inputs remain the same) ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-gray-400 -translate-y-1/2" />
              <Input
                type="email"
                name="email"
                value={customerEmail}
                readOnly
                className="pl-10 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
             <div className="relative mt-1">
                <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-gray-400 -translate-y-1/2" />
                <Input id="name" {...register('name')} className="pl-10" />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            {state.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>}
          </div>


          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
                 <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 text-gray-400 -translate-y-1/2" />
                {/* --- FIX START --- */}
                {/* 3. Register the input with react-hook-form AND add an onChange handler */}
                <Input 
                  id="password" 
                  type="password" 
                  {...register('password')} 
                  onChange={(e) => setPassword(e.target.value)} // Capture password on change
                  className="pl-10" 
                />
                {/* --- FIX END --- */}
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            {state.errors?.password && <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>}
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}