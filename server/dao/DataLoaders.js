import DataLoader from "dataloader";

// Rozdeli pole `items` na vysledne pole poli, ktere je stejne dlouhe, jako pole `ids`.
// V tomto vyslednem poli je na indexu `i` pole s polozkami,
// ktere maji vsechny stejnou hodnotu v `idFieldName`
// a ta je stejna jako hodnota v `ids` na indexu `i`.
const splitIntoArraysById = (ids, items, idFieldName) => {
  return ids.map(id => items.filter(i => i[idFieldName] === id));
};

// Vrati pole stejne dlouhe jako pole `ids`. V nem je na indexu `i` polozka z `items`,
// kteda ma stejnou hodnotu v `idFieldName` jako je hodnota v `ids` na indexu `i`.
// Pokud takova polozka v `items` neexistuje, je ve vyslednem poli `null`.
const fillArrayById = (ids, items, idFieldName) => {
  return ids.map(id => items.find(i => i[idFieldName] === id) || null );
};

// Pozor, zalezi na tom, zda dataloader vraci pole objektu, nebo pole poli objektu.
// Pri nacitani jedne hodnoty vracej pole objektu, pri nacitani kolekce pole poli objektu.
export const createDataLoaders = dao => {
  const dataLoaders = {
    invoiceItemsLoader: new DataLoader(invoiceIds => {
      return dao
        .allInvoiceItems([
          {
            field: "invoiceId",
            op: "in",
            value: invoiceIds
          }
        ])
        .then(items => splitIntoArraysById(invoiceIds, items, "invoiceId"));
    }),
    singleAddressBookLoader: new DataLoader(addressBookIds => {
      return dao
        .allAddressBooks([
          {
            field: "id",
            op: "in",
            value: addressBookIds
          }
        ])
        .then(addressBooks => fillArrayById(addressBookIds, addressBooks, "id"));
    }),
    singlePriceListLoader: new DataLoader(priceListIds => {
      return dao
        .allPriceLists([
          {
            field: "id",
            op: "in",
            value: priceListIds
          }
        ])
        .then(priceLists => fillArrayById(priceListIds, priceLists, "id"));
    })
  };

  return dataLoaders;
};
