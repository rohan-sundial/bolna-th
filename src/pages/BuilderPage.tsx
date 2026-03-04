import cx from 'classnames';
import { useParams } from 'react-router-dom';

export function BuilderPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={cx('p-6')}>
      <h1 className={cx('text-2xl font-semibold', 'text-charcoal-800')}>
        Workflow Builder
      </h1>
      <p className={cx('mt-2', 'text-charcoal-700')}>
        Editing workflow:{' '}
        <code className={cx('px-2 py-1', 'rounded', 'bg-cream-200')}>{id}</code>
      </p>
    </div>
  );
}
