import { repository } from '../data';
import { CheckInForm } from '../features/checkin';

export function App() {
  return (
    <main className="app">
      <h1>Check in</h1>
      <CheckInForm onSave={repository.addCheckIn} />
    </main>
  );
}
