document.addEventListener("DOMContentLoaded", () => {
    // ギフトコンテナとボタン要素を取得
    const giftContainer = document.getElementById("giftContainer");
    const addGiftBtn = document.getElementById("addGiftBtn");
    const specialNumberBtn = document.getElementById("specialNumberBtn");

    // ページ読み込み時に保存されているギフト情報を復元
    loadGifts();

    // 「ギフト」ボタンがクリックされた時の処理
    addGiftBtn.addEventListener("click", () => {
        alert("ギフト名、ポイント数、初期値は後から変更できません。");

        // ギフト名を入力
        const giftName = prompt("ギフト名を入力してください:", "バラ");
        if (!giftName) {
            alert("ギフト名は必須です。処理を中止します。");
            return;
        }

        // ポイント数を入力
        const giftPoints = parseInt(prompt("ポイント数を入力してください:", "10"));
        if (isNaN(giftPoints) || giftPoints <= 0) {
            alert("ポイント数は正の整数で入力してください。処理を中止します。");
            return;
        }

        // ギフト数
        const initialCount = parseInt(prompt("ギフト数を入力してください:", "100"));
        if (isNaN(initialCount) || initialCount < 0) {
            alert("初期値は0以上の整数で入力してください。処理を中止します。");
            return;
        }

        // ギフトを追加
        addGift(giftName, giftPoints, initialCount);
        saveGifts(); // ギフト情報を自動保存
    });

   // 「キリ番」ボタンがクリックされた時の処理
specialNumberBtn.addEventListener("click", () => {
    // 選択肢を作成
    const options = ["スター", "コメント"];
    const selectedType = prompt(`以下から選択してください:\n1. スター\n2. コメント`);

    let isStar;
    if (selectedType === "1") {
        isStar = true;
    } else if (selectedType === "2") {
        isStar = false;
    } else {
        alert("無効な選択です。処理を中止します。");
        return;
    }

    const type = isStar ? "スター" : "コメント";

    // デフォルトの個数を設定
    const defaultCount = isStar ? 1000 : 100;

    // 個数を入力
    const count = parseInt(prompt(`個数を入力してください`, defaultCount), 10);
    if (isNaN(count) || count <= 0) {
        alert("個数は正の整数で入力してください。処理を中止します。");
        return;
    }

    // スペシャルナンバーを追加
    const typeText = isStar ? "スタキリ" : "コメキリ";
    addSpecialNumber(typeText, count, false);
    saveGifts(); // ギフト情報を自動保存
});


    // ギフトを追加する関数
    function addGift(name, points, initialCount) {
        const giftDiv = document.createElement("div");
        giftDiv.className = "gift-item"; // ギフトアイテムのクラスを設定
    
        // ギフトのヘッダー部分
        const giftHeader = document.createElement("div");
        giftHeader.className = "gift-header";
        giftHeader.innerHTML = `
            ${name} (${points.toLocaleString()}pt) あと <span class="gift-count">${initialCount.toLocaleString()}</span>個
        `;
    
        // ギフトの操作ボタン（増減）
        const giftControls = document.createElement("div");
        giftControls.className = "gift-controls";

        // ヘッダーとボタンの間に「+」記号を追加
        const minusSymbol = document.createElement("div");
        minusSymbol.className = "plus-symbol";
        minusSymbol.textContent = "+";

        // 増加ボタンのコンテナ
        const increaseContainer = document.createElement("div");
        increaseContainer.className = "increase-container";
    
        // 減少ボタンのコンテナ
        const decreaseContainer = document.createElement("div");
        decreaseContainer.className = "decrease-container";

        // ボタンと削除の間に「-」記号を追加
        const plusMinusSymbol = document.createElement("div");
        plusMinusSymbol.className = "minus-symbol";
        plusMinusSymbol.textContent = "-";

        // 増加ボタンを作成
        const increments = [1, 10, 50, 100];
        increments.forEach(value => {
            const plusBtn = document.createElement("button");
            plusBtn.textContent = `${value}`;
            plusBtn.className = "increment";
            plusBtn.addEventListener("click", () => {
                updateGiftCount(giftDiv, value); // ギフトのカウントを更新
                saveGifts(); // ギフト情報を自動保存
            });
            increaseContainer.appendChild(plusBtn);
        });

        // 減少ボタンを作成
        increments.forEach(value => {
            const minusBtn = document.createElement("button");
            minusBtn.textContent = `${value}`;
            minusBtn.className = "decrement";
            minusBtn.addEventListener("click", () => {
                updateGiftCount(giftDiv, -value); // ギフトのカウントを更新
                saveGifts(); // ギフト情報を自動保存
            });
            decreaseContainer.appendChild(minusBtn);
        });
    
        // 削除ボタンを作成
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "削除";
        deleteBtn.addEventListener("click", () => {
            const confirmDelete = confirm("本当に削除してもよろしいですか？");
            if (confirmDelete) {
                giftContainer.removeChild(giftDiv); // ギフトアイテムを削除
                saveGifts(); // ギフト情報を自動保存
            }
        });
    
        giftDiv.appendChild(giftHeader); // ギフトヘッダーを追加
        giftDiv.appendChild(minusSymbol); // ヘッダーとボタンの間の「-」
        giftControls.appendChild(increaseContainer); // 増加ボタンのコンテナを追加
        giftControls.appendChild(decreaseContainer); // 減少ボタンのコンテナを追加
        giftDiv.appendChild(giftControls); // 増減ボタンを追加
        giftControls.appendChild(plusMinusSymbol); // ボタンと削除の間の「-」
        giftDiv.appendChild(deleteBtn); // 削除ボタンを追加
    
        giftContainer.appendChild(giftDiv); // ギフトアイテムをコンテナに追加
    }
    

    // スペシャルナンバーを追加する関数
    function addSpecialNumber(type, count, achieved) {
        const specialDiv = document.createElement("div");
        specialDiv.className = "gift-item";
        if (achieved) specialDiv.classList.add("achieved");
    
        // スペシャルナンバーのヘッダー部分
        const specialHeader = document.createElement("div");
        specialHeader.className = "gift-header";
        specialHeader.innerHTML = `
            ${type} <span class="gift-count">${count.toLocaleString()}</span>
        `;
    
        // 達成用の文字を追加
        if (achieved) {
            const achievedText = document.createElement("span");
            achievedText.className = "achieved-text";
            achievedText.textContent = " 達成";
            specialHeader.appendChild(achievedText);
        }
    
        // 達成チェックボックスを作成
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = achieved;
        checkBox.addEventListener("change", () => {
            if (checkBox.checked) {
                specialDiv.classList.add("achieved");
                const achievedText = document.createElement("span");
                achievedText.className = "achieved-text";
                achievedText.textContent = " 達成";
                specialHeader.appendChild(achievedText); // 「個」の後ろに挿入
            } else {
                specialDiv.classList.remove("achieved");
                const achievedText = specialHeader.querySelector(".achieved-text");
                if (achievedText) {
                    specialHeader.removeChild(achievedText); // 達成ラベルを削除
                }
            }
            saveGifts(); // ギフト情報を自動保存
        });
    
        const label = document.createElement("label");
        label.appendChild(checkBox);
        label.appendChild(document.createTextNode(" 達成"));
    
        // 削除ボタンを作成
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "削除";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => {
            const confirmDelete = confirm("本当に削除してもよろしいですか？");
            if (confirmDelete) {
                giftContainer.removeChild(specialDiv); // スペシャルナンバーアイテムを削除
                saveGifts(); // ギフト情報を自動保存
            }
        });
    
        specialDiv.appendChild(specialHeader); // スペシャルナンバーのヘッダーを追加
        specialDiv.appendChild(label); // 達成チェックボックスを追加
        specialDiv.appendChild(deleteBtn); // 削除ボタンを追加
        giftContainer.appendChild(specialDiv); // スペシャルナンバーアイテムをコンテナに追加
    }

    // ギフトのカウントを更新する関数
    function updateGiftCount(giftDiv, value) {
        const countSpan = giftDiv.querySelector(".gift-count");
        let currentCount = parseInt(countSpan.textContent.replace(/,/g, ""), 10);
        currentCount += value; // カウントを更新
        if (currentCount < 0) currentCount = 0; // 0未満にはならないように設定
        countSpan.textContent = currentCount.toLocaleString(); // 更新されたカウントを表示
    
        // 「個」の後ろに挿入するための処理
        const giftHeader = giftDiv.querySelector(".gift-header");
        const achievedText = giftHeader.querySelector(".achieved-text");
    
        if (currentCount === 0) {
            if (!achievedText) {
                // 達成の文字を挿入
                const newAchievedText = document.createElement("span");
                newAchievedText.className = "achieved-text";
                newAchievedText.textContent = " 達成";
                giftHeader.appendChild(newAchievedText); // 「個」の後ろに挿入
            }
            giftDiv.classList.add("achieved"); // 達成スタイルを適用
        } else {
            if (achievedText) {
                giftHeader.removeChild(achievedText); // 達成ラベルを削除
            }
            giftDiv.classList.remove("achieved"); // 達成スタイルを解除
        }
    }
    
    // ギフト情報をローカルストレージに保存する関数
    function saveGifts() {
        const gifts = [];
        const giftItems = giftContainer.querySelectorAll(".gift-item");
        giftItems.forEach(giftItem => {
            const header = giftItem.querySelector(".gift-header").textContent.trim();
            const count = giftItem.querySelector(".gift-count");
            const countValue = count ? count.textContent.replace(/,/g, "") : null;
            const achieved = giftItem.classList.contains("achieved"); // 達成状態を確認
            gifts.push({ header, count: countValue, achieved });
        });
        localStorage.setItem("gifts", JSON.stringify(gifts)); // ギフト情報を保存
    }
    

    // 保存されたギフト情報を読み込む関数
    function loadGifts() {
        const savedGifts = JSON.parse(localStorage.getItem("gifts") || "[]");
        savedGifts.forEach(gift => {
            if (gift.header.includes("スタキリ") || gift.header.includes("コメキリ")) {
                const count = parseInt(gift.count);
                const achieved = gift.achieved;
                const type = gift.header.includes("スタキリ") ? "スタキリ" : "コメキリ";
                addSpecialNumber(type, count, achieved);
            } else {
                const name = gift.header.split(" ")[0];
                const points = parseInt(gift.header.match(/\((\d+)/)[1], 10);
                const count = parseInt(gift.count);
                addGift(name, points, count);
    
                // 達成状態を適用
                const giftItems = giftContainer.querySelectorAll(".gift-item");
                const giftDiv = giftItems[giftItems.length - 1]; // 最新のギフトアイテムを取得
                if (gift.achieved) {
                    giftDiv.classList.add("achieved");
                    const giftHeader = giftDiv.querySelector(".gift-header");
                    const achievedText = document.createElement("span");
                    achievedText.className = "achieved-text";
                    achievedText.textContent = " 達成";
                    giftHeader.appendChild(achievedText);
                }
            }
        });
    }
    
});
