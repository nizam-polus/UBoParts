// react
import React, { PropsWithChildren, useRef, useState } from 'react';
// third-party
import classNames from 'classnames';
// application
import AppImage from '~/components/shared/AppImage';
// import { ArrowDownSm7x5Svg } from '~/svg';
import { useGlobalMousedown } from '~/services/hooks';

export interface IDropdownItem {
    title: string;
    image?: string;
}

interface Props<T extends IDropdownItem> extends PropsWithChildren<{}> {
    label?: React.ReactNode;
    title?: React.ReactNode;
    items?: T[];
    onItemClick?: (item: T) => void;
}

function Dropdown<T extends IDropdownItem>(props: Props<T>) {
    const {
        label,
        title,
        items = [],
        onItemClick,
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const hasLabel = !!label;
    const hasTitle = !!title;

    const classes = classNames('topbar__item-button topbar__menu', {
        'topbar__menu--open': isOpen,
    });

    const handleButtonClick = () => {
        setIsOpen((prev) => !prev);
    };

    const handleItemClick = (item: T) => {
        setIsOpen(false);

        if (onItemClick) {
            onItemClick(item);
        }
    };

    useGlobalMousedown((event) => {
        if (rootRef.current && !rootRef.current.contains(event.target as HTMLElement)) {
            setIsOpen(false);
        }
    }, [setIsOpen, rootRef]);

    return (
        <div className={classes} ref={rootRef} style={{display: "grid", placeContent: "center"}}>
            <button
                className="topbar__button topbar__button--has-arrow topbar__menu-button "
                style={{color: "white", border: "1px solid grey", padding: "0 10px", height: "2.4rem", borderRadius:"5px"}}
                type="button"
                onClick={handleButtonClick}
            >
                <div style={{display: "flex", gap: "10px"}}>
                    <div>{hasLabel && <span className="topbar__button-label">{label}</span>}
                    </div>
                    <div>{hasTitle && <span className="topbar__button-title">{title}</span>}
                    </div>
                    <div>
                        {/* <span className="topbar__button-arrow"> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M12 16l-6-6h12" fill="#FFFFFF" />
                        </svg>
                        {/* </span> */}
                    </div>

                </div>
                
            </button>
            <div className="topbar__menu-body ubo-dropdown-lang">
                {items.map((item, index) => (
                    <button
                        key={index}
                        className="topbar__menu-item"
                        type="button"
                        onClick={() => handleItemClick(item)}
                    >
                        {!!item.image && (
                            <AppImage width={"30px"} height={"20px"} src={item.image} alt={item.title} />
                        )}
                        <span>{item.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Dropdown;
