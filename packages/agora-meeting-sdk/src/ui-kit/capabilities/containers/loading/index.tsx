import { useUIStore } from '@/infra/hooks';
import { useGlobalContext } from 'agora-meeting-core';
import { observer } from 'mobx-react';
import { Card, Loading } from '~ui-kit';
import './index.css';

export const LoadingContainer = observer(() => {
  const { loading } = useUIStore();
  return loading ? <PageLoading /> : null;
});

const PageLoading = () => {
  return (
    <Card width={90} height={90} className="card-loading-position">
      <Loading></Loading>
    </Card>
  );
};
