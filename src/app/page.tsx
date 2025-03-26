import GridEditor from '@/components/GridEditor';
import { GridProvider } from '@/context/GridContext';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GridProvider>
        <GridEditor />
      </GridProvider>
    </div>
  );
}
