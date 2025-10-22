import { Header } from '@/components/common/Header';

export default function TestHeaderPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow p-6'>
        <h1>Test Header Page</h1>
        <p>This page is for testing the responsive behavior of the Header component.</p>
        <div className='mt-8' style={{ width: '300px', border: '1px solid red', padding: '10px' }}>
          <p>Simulate narrow screen content here.</p>
        </div>
      </main>
    </div>
  );
}
