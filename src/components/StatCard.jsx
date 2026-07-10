import { memo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const clampSx = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  wordBreak: 'break-word',
};

const StatCard = memo(({ title, shortTitle, value, icon, color = 'primary.main', subtitle, trend }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const displayTitle = isMobile && shortTitle ? shortTitle : title;

  const titleNode = (
    <Typography
      color="text.secondary"
      variant="body2"
      fontWeight={500}
      title={title}
      sx={{
        ...clampSx,
        fontSize: { xs: '0.68rem', sm: '0.8rem', md: '0.875rem' },
        lineHeight: 1.35,
        minHeight: { xs: '2.7em', sm: 'auto' },
      }}
    >
      {displayTitle}
    </Typography>
  );

  return (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <CardContent
        sx={{
          p: { xs: 1.25, sm: 2, md: 3 },
          height: '100%',
          '&:last-child': { pb: { xs: 1.25, sm: 2, md: 3 } },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'flex-start' },
            gap: { xs: 0.75, sm: 1 },
            height: '100%',
          }}
        >
          {icon && (
            <Avatar
              sx={{
                bgcolor: color,
                width: { xs: 32, sm: 40, md: 52 },
                height: { xs: 32, sm: 40, md: 52 },
                boxShadow: 1,
                flexShrink: 0,
                order: { xs: 0, sm: 1 },
                alignSelf: { xs: 'flex-start', sm: 'flex-start' },
                '& .MuiSvgIcon-root': { fontSize: { xs: 16, sm: 20, md: 24 } },
              }}
            >
              {icon}
            </Avatar>
          )}

          <Box minWidth={0} flex={1} order={{ xs: 1, sm: 0 }} width="100%">
            <Tooltip title={title} enterTouchDelay={0} arrow placement="top">
              <Box component="span" sx={{ display: 'block', mb: { xs: 0.25, sm: 0.5 } }}>
                {titleNode}
              </Box>
            </Tooltip>

            <Typography
              variant="h4"
              fontWeight={700}
              lineHeight={1.1}
              sx={{
                fontSize: { xs: '1.35rem', sm: '1.5rem', md: '2.125rem' },
                fontVariantNumeric: 'tabular-nums',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {value ?? '—'}
            </Typography>

            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={0.5}
                sx={{ ...clampSx, WebkitLineClamp: 1 }}
              >
                {subtitle}
              </Typography>
            )}

            {trend && (
              <Typography
                variant="caption"
                color={trend.positive ? 'success.main' : 'error.main'}
                display="block"
                mt={0.5}
                sx={{ ...clampSx, WebkitLineClamp: 1 }}
              >
                {trend.label}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

StatCard.displayName = 'StatCard';
export default StatCard;
