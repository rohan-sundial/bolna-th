import cx from 'classnames';

export function FlowsPage() {
  return (
    <div className={cx('p-6')}>
      <h1 className={cx('text-2xl font-semibold', 'text-charcoal-800')}>
        Workflows
      </h1>
      <p className={cx('mt-2', 'text-charcoal-700')}>
        Flows list will be implemented here.
      </p>
    </div>
  );
}
