import cx from 'classnames';
import { Outlet } from 'react-router-dom';

export function MainContent() {
  return (
    <main className={cx('flex-1 flex flex-col', 'bg-cream-50', 'overflow-hidden')}>
      <Outlet />
    </main>
  );
}
