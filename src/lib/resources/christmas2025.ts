import festiveCertificate from '$lib/assets/festive-certificate.png';
import { SantasGiftContainer2025 } from '$lib/containers/2025-santas-gift-container';
import { SantasMegaGiftContainer2025 } from '$lib/containers/2025-santas-mega-gift-container';
import type { Resource } from '$lib/resource';

export const FestiveCertificate: Resource = {
  name: 'Festive Certificate',
  image: festiveCertificate,
  convertsTo: [
    {
      container: SantasGiftContainer2025,
      cost: 1,
      returns: 1
    },
    {
      container: SantasMegaGiftContainer2025,
      cost: 5,
      returns: 1
    }
  ]
};
