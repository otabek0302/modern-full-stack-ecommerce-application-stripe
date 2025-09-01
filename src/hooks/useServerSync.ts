import { useEffect, useRef } from 'react';
import { useStateContext } from '@/contexts/state-context';
import { useUserContext } from '@/contexts/user-context';

export const useServerSync = () => {
    const { syncCartWithServer, syncWishlistWithServer } = useStateContext();
    const { user, isAuthenticated } = useUserContext();
    const hasSyncedRef = useRef(false);

    useEffect(() => {
        // Only sync once when user logs in and hasn't been synced yet
        if (isAuthenticated && user?._id && !hasSyncedRef.current) {
            const syncData = async () => {
                try {
                    hasSyncedRef.current = true;
                    // Sync both cart and wishlist in parallel
                    await Promise.all([
                        syncCartWithServer(user._id),
                        syncWishlistWithServer(user._id)
                    ]);
                } catch (error) {
                    console.error('Error syncing data with server:', error);
                    // Reset the flag on error so we can retry
                    hasSyncedRef.current = false;
                }
            };

            syncData();
        }

        // Reset the sync flag when user logs out
        if (!isAuthenticated) {
            hasSyncedRef.current = false;
        }
    }, [isAuthenticated, user?._id]); // Remove syncCartWithServer and syncWishlistWithServer from dependencies

    return {
        isSyncing: false
    };
};
