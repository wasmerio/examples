// src/components/HelpDialog.tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' aria-label='ヘルプ'>
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
            <circle cx='12' cy='12' r='10' />
            <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
            <path d='M12 17h.01' />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[85dvh] overflow-y-auto pt-16 pb-8 sm:max-h-[80dvh]'>
        <DialogHeader>
          <DialogTitle>使い方ガイド</DialogTitle>
          <DialogDescription>このテンプレートの基本的な使い方をご紹介します。</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <h4 className='font-medium'>🚀 クイックスタート</h4>
            <ul className='list-disc space-y-1 pl-5'>
              <li>
                リポジトリをクローン
                <code className='bg-muted ml-2 rounded px-1.5 py-0.5 text-sm'>git clone [repository-url]</code>
              </li>
              <li>
                依存関係をインストール
                <code className='bg-muted ml-2 rounded px-1.5 py-0.5 text-sm'>npm install</code>
              </li>
              <li>
                開発サーバーを起動
                <code className='bg-muted ml-2 rounded px-1.5 py-0.5 text-sm'>npm run dev</code>
              </li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>⚡️ 主な機能</h4>
            <ul className='list-disc space-y-1 pl-5'>
              <li>
                <em>Astro v5</em>: 高速なビルドと優れたパフォーマンス
                <span className='text-muted-foreground ml-2 block text-sm'>
                  静的サイト生成とアイランドアーキテクチャに対応
                </span>
              </li>
              <li>
                <em>TailwindCSS v4</em>: 最新のユーティリティファーストCSS
                <span className='text-muted-foreground ml-2 block text-sm'>
                  カスタムプロパティとモダンな構文をサポート
                </span>
              </li>
              <li>
                <em>shadcn/ui</em>: カスタマイズ可能なUIコンポーネント
                <span className='text-muted-foreground ml-2 block text-sm'>
                  Button, Dialog, Card など多様なコンポーネントを利用可能
                </span>
              </li>
              <li>
                <em>ダークモード</em>: システム設定に連動
                <span className='text-muted-foreground ml-2 block text-sm'>
                  CSSカスタムプロパティによる自動切り替え対応
                </span>
              </li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>🔧 環境設定</h4>
            <ul className='list-disc space-y-1 pl-5'>
              <li>
                <em>開発環境</em>: NODE_ENV=development
                <span className='text-muted-foreground ml-2 block text-sm'>http://localhost:3000 で起動</span>
              </li>
              <li>
                <em>ステージング</em>: npm run stg
                <span className='text-muted-foreground ml-2 block text-sm'>ステージング環境用のビルドを生成</span>
              </li>
              <li>
                <em>本番環境</em>: npm run prod
                <span className='text-muted-foreground ml-2 block text-sm'>最適化された本番用ビルドを生成</span>
              </li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>📝 カスタマイズ</h4>
            <p className='text-muted-foreground text-sm'>
              環境に応じたURL設定は
              <code className='bg-muted mx-1 rounded px-1.5 py-0.5'>src/lib/constants.ts</code>
              で管理できます。
            </p>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>📚 リソース</h4>
            <p className='text-muted-foreground text-sm'>
              詳細なドキュメントは
              <a
                href='https://github.com/n-tong009/astro-shadcn-template'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary ml-1 hover:underline'
              >
                GitHubリポジトリ
              </a>
              をご確認ください。
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
