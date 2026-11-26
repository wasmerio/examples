// src/components/SettingsDialog.tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

const SettingsDialog = () => {
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'system';
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const applyTheme = (selectedTheme: string) => {
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (selectedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem('theme', value);
    applyTheme(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' aria-label='設定'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
            <circle cx='12' cy='12' r='3' />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[85dvh] overflow-y-auto pt-16 pb-8 sm:max-h-[80dvh]'>
        <DialogHeader>
          <DialogTitle>設定</DialogTitle>
          <DialogDescription>アプリケーションの設定を変更できます。</DialogDescription>
        </DialogHeader>
        <div className='grid gap-6 py-4'>
          <div className='space-y-4'>
            <div>
              <h4 className='mb-3 font-medium'>外観</h4>
              <RadioGroup value={theme} onValueChange={handleThemeChange}>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='light' id='light' />
                  <Label htmlFor='light'>ライト</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='dark' id='dark' />
                  <Label htmlFor='dark'>ダーク</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='system' id='system' />
                  <Label htmlFor='system'>システム設定に従う</Label>
                </div>
              </RadioGroup>
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='notifications'>通知</Label>
                <p className='text-muted-foreground text-sm'>アップデートの通知を受け取る</p>
              </div>
              <Switch id='notifications' checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>

          <div className='space-y-4'>
            <h4 className='font-medium'>バージョン情報</h4>
            <div className='text-muted-foreground text-sm'>
              <p>Astro v5.7.5</p>
              <p>TailwindCSS v4.1.4</p>
              <p>React v19.1.0</p>
              <p>shadcn/ui v2.5.0</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
