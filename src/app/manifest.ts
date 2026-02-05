import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'シンプルタスク管理',
        short_name: 'タスク管理',
        description: '時間指定リマインド機能付きのタスク管理アプリ',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
