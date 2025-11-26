
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { CMSPage, MediaItem, ThemeConfig, KnowledgeBaseArticle } from '../../types';

export const ContentModule: React.FC<{ subTab: string }> = ({ subTab }) => {
    
    const [pages, setPages] = useState<CMSPage[]>([{ id: 'p1', title: 'Terms of Service', slug: 'terms', lastEdited: '2025-10-01' }]);
    const [kb, setKb] = useState<KnowledgeBaseArticle[]>([{ id: 'kb1', title: 'How to buy?', category: 'Buying', views: 1200, status: 'Published' }]);
    const [media] = useState<MediaItem[]>([{ id: 'm1', name: 'logo.png', url: '/logo.png', size: '24KB' }]);
    const [themes] = useState<ThemeConfig[]>([{ 
        id: 'th1', 
        name: 'Dark Nebula (Default)', 
        active: true, 
        mode: 'dark', 
        colors: { main: '#0f0518', card: '#1b142d', primary: '#8b5cf6', border: '#2f264a' } 
    }]);

    const handleSave = (setter: any, list: any[]) => (item: any) => {
        if (list.find(i => i.id === item.id)) setter(list.map(i => i.id === item.id ? item : i));
        else setter([...list, item]);
    };
    const handleDelete = (setter: any, list: any[]) => (id: string) => setter(list.filter(i => i.id !== id));

    if (subTab === 'CMS') return <GenericModule<CMSPage> title="Pages" data={pages} columns={[{key:'title', label:'Title'}, {key:'slug', label:'Slug'}]} fields={[{key:'title', label:'Title', type:'text'}, {key:'slug', label:'Slug', type:'text'}]} onSave={handleSave(setPages, pages)} onDelete={handleDelete(setPages, pages)} />;
    if (subTab === 'KB') return <GenericModule<KnowledgeBaseArticle> title="Knowledge Base" data={kb} columns={[{key:'title', label:'Question'}, {key:'category', label:'Category'}, {key:'status', label:'Status'}]} fields={[{key:'title', label:'Question', type:'text'}, {key:'status', label:'Status', type:'select', options:['Published','Draft']}]} onSave={handleSave(setKb, kb)} onDelete={handleDelete(setKb, kb)} />;
    if (subTab === 'MEDIA') return <GenericModule<MediaItem> title="Media Library" data={media} columns={[{key:'name', label:'File Name'}, {key:'size', label:'Size'}]} fields={[]} onSave={()=>{}} onDelete={()=>{}} />;
    if (subTab === 'THEMES') return <GenericModule<ThemeConfig> title="Themes" data={themes} columns={[{key:'name', label:'Theme'}, {key:'active', label:'Active'}]} fields={[]} onSave={()=>{}} onDelete={()=>{}} />;
    
    if (subTab === 'EMAILS') return <div className="text-gray-500 p-4">Email Templates Editor (HTML/MJML)</div>;
    if (subTab === 'SEO') return <div className="text-gray-500 p-4">Global SEO Settings (Meta Tags, Sitemap)</div>;
    if (subTab === 'LOCALIZATION') return <div className="text-gray-500 p-4">Language Files (i18n) & Currencies</div>;

    return <div>Select Content Module</div>;
}
