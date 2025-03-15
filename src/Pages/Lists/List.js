import React, {useState} from "react";
import styles from "./styles.module.scss";
import {CloseOutlined, LeftCircleOutlined} from "@ant-design/icons";
import {Button, Input, Space} from "antd";
import {addTolist, deleteFromList} from "entities/lists";
import { useDispatch, useSelector } from "react-redux";

const List = ({list, setList}) => {
    const listState = useSelector(s => s.listSlyce[list]);
    const [input, setInput] = useState("");
    const dispatch = useDispatch();

    // Преобразуем объект в массив
    const itemsArray = listState ? Object.values(listState) : [];

    const title = {
        BlackList: "Черный лист",
        WhiteList: "Белый лист",
    };

    const getFaviconUrl = (domain) => {
        return `https://${domain}/favicon.ico`;
    };

    return (
        <div className={styles.listPage}>
            <div className={styles.header}>
                <LeftCircleOutlined className={styles.back} onClick={() => setList(null)} />
                <div className={styles.h}>{title[list]}</div>
            </div>
            <div className={styles.listList}>
                {itemsArray.map(el => (
                    <div className={styles.item} key={el}>
                        <div className={styles.itemFlex}>
                            <img 
                                src={getFaviconUrl(el)} 
                                alt='logo' 
                                className={styles.icon} 
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = 'fallback-icon.png';
                                }}
                            />
                            {el}
                        </div>
                        <CloseOutlined 
                            className={styles.close} 
                            onClick={() => dispatch(deleteFromList({item: el, list}))} 
                        />
                    </div>
                ))}
            </div>
            <Space.Compact className={styles.input}>
                <Input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    placeholder='Введите домен (например: example.com)'
                />
                <Button
                    type='primary'
                    onClick={() => {
                        if (input) {
                            dispatch(addTolist({item: input.trim(), list}));
                            setInput("");
                        }
                    }}>
                    Подтвердить
                </Button>
            </Space.Compact>
        </div>
    );
};

export default React.memo(List);