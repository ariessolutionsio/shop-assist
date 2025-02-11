import { TCartState } from '../../types/generated/ctp';
import { designTokens } from '@commercetools-uikit/design-system';

// Taking reference stylings from CT UI-Kit, used in orders section, where:
// <name> text-color | background-color
//
// Open --color-info-40 | --color-info-95
// Confirmed --color-primary-25 | --color-primary-95
// Canceled --color-warning-40 | --color-warning-95
// Complete --color-success-40 | --color-success-95

const Badge = ({ cartStatus }: { cartStatus: TCartState }) => {
  const badgeStylings = [
    {
      id: TCartState.Active, // Maps to orders "Open" styling
      color: designTokens.colorInfo40,
      background: designTokens.colorInfo95,
    },
    {
      id: TCartState.Merged, // Maps to orders "Confirmed" styling
      color: designTokens.colorPrimary25,
      background: designTokens.colorPrimary95,
    },
    {
      id: TCartState.Frozen, // Maps to orders "Cancelled" styling
      color: designTokens.colorWarning40,
      background: designTokens.colorWarning95,
    },
    {
      id: TCartState.Ordered, // Maps to orders "Complete" styling
      color: designTokens.colorSuccess40,
      background: designTokens.colorSuccess95,
    },
  ];

  const selectedStyling = badgeStylings.find((e) => e.id === cartStatus);

  return (
    <div
      style={{
        ...selectedStyling,
        borderRadius: designTokens.borderRadius4,
        textAlign: 'center',
        fontWeight: 'semi-bold',
        width: '5rem',
        padding: '0.15rem 0',
      }}
    >
      {cartStatus}
    </div>
  );
};

export default Badge;
