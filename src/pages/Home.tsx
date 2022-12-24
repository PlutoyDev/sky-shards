import Stack from '@mui/material/Stack';
import { DateTime } from 'luxon';
import Clock from '../components/Clock';
import predict from '../shardPredictor';

export default function Home() {
  return (
    <Stack>
      <Clock fontSize='2rem' date={DateTime.local(2022, 12, 24, 23, 43)} local relative trim></Clock>
    </Stack>
  );
}
