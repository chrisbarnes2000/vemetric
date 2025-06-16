import { Box, Flex, Text, Icon, Button } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import type { UsageStats } from '@vemetric/common/usage';
import { TbBolt } from 'react-icons/tb';
import { proxy, useSnapshot } from 'valtio';
import { DialogRoot, DialogContent, DialogBody, DialogCloseTrigger } from '@/components/ui/dialog';
import { UsageStatsProgress } from '@/components/usage-stats-progress';

export const eventLimitStore = proxy({
  organizationId: '',
  hasClosedEventLimitDialog: false,
  showEventLimitDialog: false,
});

interface Props {
  projectId: string;
  usageStats?: UsageStats;
  eventsIncluded: number;
}

export const EventLimitDialog = ({ projectId, usageStats, eventsIncluded }: Props) => {
  const { hasClosedEventLimitDialog, showEventLimitDialog } = useSnapshot(eventLimitStore);

  if (hasClosedEventLimitDialog || !showEventLimitDialog) return null;

  const onClose = () => {
    eventLimitStore.showEventLimitDialog = false;
    eventLimitStore.hasClosedEventLimitDialog = true;
  };

  return (
    <DialogRoot
      open
      placement="center"
      size={{ base: 'full', md: 'md' }}
      onOpenChange={({ open }) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent minHeight={{ base: '100dvh', md: 'auto' }} rounded={{ base: 'none', md: 'lg' }} bg="bg.card">
        <DialogBody p="6">
          <Flex direction="column" align="center" textAlign="center" gap={2}>
            <Box pos="relative" mb={2}>
              <Icon
                asChild
                boxSize="64px"
                color="orange.solid"
                pos="absolute"
                transform="scale(1.15)"
                opacity={0.35}
                animationName="ping"
                animationDuration="1.5s"
                animationIterationCount="infinite"
              >
                <TbBolt />
              </Icon>
              <Icon asChild boxSize="64px" color="orange.solid">
                <TbBolt />
              </Icon>
            </Box>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              You have exceeded the included events limit
            </Text>
            <Box maxW="500px" w="full" mt={6} mb={3}>
              <UsageStatsProgress usageStats={usageStats} eventsIncluded={eventsIncluded} />
            </Box>
            <Text fontSize="lg" opacity={0.9} maxW="550px" fontWeight="medium" mb={2}>
              Please upgrade to a higher plan.
            </Text>
            <Button asChild onClick={onClose}>
              <Link to="/p/$projectId/settings" params={{ projectId }} search={{ tab: 'billing' }}>
                Upgrade
              </Link>
            </Button>
          </Flex>
        </DialogBody>
        <DialogCloseTrigger colorPalette="gray" />
      </DialogContent>
    </DialogRoot>
  );
};
