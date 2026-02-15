import {useStockStore} from "../store/useStockStore";
import {Switch, Tooltip} from "@heroui/react";

const BellIcon = ({className}: {className?: string}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C11.172 2 10.5 2.672 10.5 3.5V4.19C8.72 4.71 7.5 6.46 7.5 8.5V14L5.71 15.79C5.08 16.42 5.52 17.5 6.41 17.5H17.59C18.48 17.5 18.92 16.42 18.29 15.79L16.5 14V8.5C16.5 6.46 15.28 4.71 13.5 4.19V3.5C13.5 2.672 12.828 2 12 2ZM10 19.5C10 20.88 11.12 22 12.5 22C13.88 22 15 20.88 15 19.5H10Z" />
    </svg>
);

const BellOffIcon = ({className}: {className?: string}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 18.69L7.84 6.14L5.27 3.49L4 4.76L6.8 7.56V8.5V14L5 15.79C4.37 16.42 4.81 17.5 5.7 17.5H17.73L19.73 19.5L21 18.23L20 18.69ZM12 22C13.11 22 14 21.11 14 20H10C10 21.11 10.89 22 12 22ZM18 14V8.5C18 6.15 16.36 4.23 14 3.68V3C14 2.45 13.55 2 13 2H11C10.45 2 10 2.45 10 3V3.17L18 11.17V14Z" />
    </svg>
);

export const NotificationToggle = () => {
    const notificationsEnabled = useStockStore(state => state.notificationsEnabled);
    const requestNotificationPermission = useStockStore(state => state.requestNotificationPermission);
    const setNotificationsEnabled = useStockStore(state => state.setNotificationsEnabled);

    const handleToggle = async (isSelected: boolean) => {
        if (isSelected) {
            // Request permission first
            await requestNotificationPermission();
        } else {
            // Disable notifications
            setNotificationsEnabled(false);
        }
    };

    return (
        <Tooltip delay={0}>
            <Tooltip.Trigger aria-label="殘值通知">
                <Switch isSelected={notificationsEnabled} onChange={handleToggle}>
                    {({isSelected}) => (
                        <Switch.Control>
                            <Switch.Thumb>
                                <Switch.Icon>{isSelected ? <BellIcon className="w-3 h-3" /> : <BellOffIcon className="w-3 h-3" />}</Switch.Icon>
                            </Switch.Thumb>
                        </Switch.Control>
                    )}
                </Switch>
            </Tooltip.Trigger>
            <Tooltip.Content placement="bottom">殘值通知</Tooltip.Content>
        </Tooltip>
    );
};
