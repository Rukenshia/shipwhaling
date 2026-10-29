import festiveToken from '$lib/assets/christmas2026/festive-token.png';
import { SantasGiftContainer2026 } from '$lib/containers/2026-santas-gift-container';
import { SantasMegaGiftContainer2026 } from '$lib/containers/2026-santas-mega-gift-container';
import { Credits, type Resource } from '$lib/resource';

export const FestiveToken: Resource = {
  name: 'Festive Token',
  image: festiveToken,
  convertsTo: [
    {
      container: SantasGiftContainer2026,
      cost: 1,
      returns: 1
    },
    {
      container: SantasMegaGiftContainer2026,
      cost: 5,
      returns: 1
    },
    {
      resource: Credits,
      cost: 1,
      returns: 375000
    }
  ]
};
