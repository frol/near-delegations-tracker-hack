const nearAPI = require("near-api-js");
const { baseEncode } = require("borsh");
const { sha256 } = require("js-sha256");

// Extracted from https://github.com/frol/near-validators-scoreboard/tree/scoreboard-mainnet
const EPOCH_BLOCK_HEIGHTS = [
9863413,
9906613,
9949813,
9993013,
10036213,
10079413,
10122613,
10165813,
10209013,
10252213,
10295413,
10338613,
10381813,
10425013,
10468213,
10511413,
10554613,
10597813,
10641013,
10684213,
10727413,
10770613,
10813813,
10857013,
10900213,
10943413,
10986613,
11029813,
11073013,
11116213,
11159413,
11202613,
11245813,
11289013,
11332213,
11375413,
11418613,
11461813,
11505013,
11548213,
11591413,
11634613,
11677813,
11721013,
11764213,
11807413,
11850613,
11893813,
11937013,
11980213,
12023413,
12066613,
12109813,
12153017,
12196217,
12239417,
12282617,
12325817,
12369017,
12412217,
12455417,
12498617,
12541817,
12585017,
12628217,
12671417,
12714617,
12757817,
12801017,
12844217,
12887417,
12930617,
12973817,
13017017,
13060225,
13103431,
13146631,
13189831,
13233031,
13276231,
13319431,
13362631,
13405831,
13449031,
13492231,
13535431,
13578631,
13621831,
13665031,
13708231,
13751431,
13794631,
13837831,
13881031,
13924231,
13967431,
14010631,
14053831,
14097031,
14140231,
14183431,
14226631,
14269831,
14313031,
14356231,
14399431,
14442631,
14485831,
14529031,
14572231,
14615431,
14658631,
14701831,
14745031,
14788231,
14831431,
14874631,
14917831,
14961031,
15004231,
15047431,
15090631,
15133831,
15177031,
15220231,
15263431,
15306631,
15349831,
15393031,
15436231,
15479431,
15522631,
15565831,
15609031,
15652231,
15695431,
15738631,
15781831,
15825031,
15868231,
15911431,
15954631,
15997831,
16041031,
16084231,
16127431,
16170631,
16213831,
16257031,
16300231,
16343431,
16386631,
16429831,
16473031,
16516231,
16559431,
16602631,
16645831,
16689031,
16732231,
16775431,
16818631,
16861831,
16905031,
16948231,
16991431,
17034631,
17077831,
17121031,
17164231,
17207431,
17250631,
17293831,
17337031,
17380231,
17423431,
17466631,
17509831,
17553031,
17596231,
17639431,
17682631,
17725831,
17769031,
17812231,
17855431,
17898631,
17941831,
17985031,
18028231,
18071431,
18114631,
18157831,
18201031,
18244231,
18287431,
18330631,
18373831,
18417031,
18460231,
18503431,
18546631,
18589831,
18633031,
18676231,
18719431,
18762631,
18805831,
18849031,
18892231,
18935431,
18978631,
19021831,
19065031,
19108231,
19151431,
19194634,
19237834,
19281034,
19324234,
19367434,
19410634,
19453834,
19497034,
19540234,
19583434,
19626634,
19669834,
19713034,
19756234,
19799434,
19842634,
19885834,
19929034,
19972234,
20015434,
20058634,
20101834,
20145034,
20188234,
20231434,
20274634,
20317834,
20361034,
20404234,
20447434,
20490634,
20533834,
20577034,
20620234,
20663434,
20706634,
20749834,
20793034,
20836234,
20879434,
20922634,
20965834,
21009034,
21052234,
21095434,
21138634,
21181834,
21225034,
21268234,
21311434,
21354634,
21397834,
21441034,
21484234,
21527434,
21570634,
21613834,
21657034,
21700234,
21743434,
21786634,
21829834,
21873034,
21916234,
21959434,
22002634,
22045834,
22089034,
22132234,
22175434,
22218634,
22261834,
22305034,
22348234,
22391434,
22434637,
22477837,
22521037,
22564237,
22607437,
22650637,
22693837,
22737037,
22780237,
22823437,
22866637,
22909837,
22953037,
22996237,
23039437,
23082637,
23125837,
23169037,
23212240,
23255440,
23298640,
23341840,
23385040,
23428240,
23471440,
23514640,
23557840,
23601040,
23644240,
23687440,
23730640,
23773840,
23817040,
23860240,
23903440,
23946640,
23989840,
24033040,
24076242,
24119442,
24162642,
24205842,
24249042,
24292242,
24335442,
24378642,
24421842,
24465042,
24508242,
24551442,
24594642,
24637842,
24681042,
24724242,
24767442,
24810642,
24853842,
24897042,
24940242,
24983442,
25026642,
25069842,
25113042,
25156242,
25199442,
25242642,
25285842,
25329042,
25372242,
25415442,
25458642,
25501842,
25545042,
25588242,
25631442,
25674642,
25717842,
25761042,
25804242,
25847442,
25890642,
25933842,
25977042,
26020242,
26063443,
26106643,
26149843,
26193044,
26236244,
26279444,
26322644,
26365844,
26409044,
26452244,
26495444, // January 01, 2021 at 00:30:23am UTC
];

const DELEGATION_HISTORY_RAW = `
foundation.near	rocknroll.poolv1.near
foundation.near	staked.poolv1.near
foundation.near	dsrvlabs.poolv1.near
foundation.near	dokiacapital.poolv1.near
foundation.near	cryptium.poolv1.near
foundation.near	buildlinks.poolv1.near
foundation.near	rocknroll.poolv1.near
foundation.near	sparkpool.poolv1.near
foundation.near	erm.poolv1.near
foundation.near	jazza.poolv1.near
foundation.near	hashquark.poolv1.near
foundation.near	hashquark.poolv1.near
foundation.near	hashquark.poolv1.near
foundation.near	bisontrails.poolv1.near
foundation.near	zkv_staketosupportprivacy.poolv1.near
foundation.near	certusone.poolv1.near
foundation.near	bisontrails.poolv1.near
foundation.near	buildlinks.poolv1.near
foundation.near	cryptium.poolv1.near
foundation.near	dokiacapital.poolv1.near
foundation.near	dsrvlabs.poolv1.near
foundation.near	staked.poolv1.near
foundation.near	sparkpool.poolv1.near
foundation.near	certusone.poolv1.near
foundation.near	zkv_staketosupportprivacy.poolv1.near
foundation.near	erm.poolv1.near
foundation.near	jazza.poolv1.near
foundation.near	nfvalidator1.near
foundation.near	nfvalidator2.near
foundation.near	nfvalidator3.near
foundation.near	nfvalidator4.near
foundation.near	zavodil.poolv1.near
foundation.near	nfvalidator1.near
foundation.near	inotel.poolv1.near
foundation.near	masternode24.poolv1.near
foundation.near	lunanova.poolv1.near
foundation.near	hashquark.poolv1.near
nfvalidator2.near	nfvalidator2.near
nfvalidator3.near	nfvalidator3.near
nfvalidator4.near	nfvalidator4.near
foundation.near	bisontrails.poolv1.near
foundation.near	buildlinks.poolv1.near
foundation.near	certusone.poolv1.near
foundation.near	cryptium.poolv1.near
foundation.near	dokiacapital.poolv1.near
foundation.near	dsrvlabs.poolv1.near
foundation.near	erm.poolv1.near
foundation.near	jazza.poolv1.near
foundation.near	sparkpool.poolv1.near
foundation.near	staked.poolv1.near
foundation.near	zkv_staketosupportprivacy.poolv1.near
foundation.near	hashquark.poolv1.near
foundation.near	fresh.poolv1.near
foundation.near	figment.poolv1.near
nfvalidator1.near	nfvalidator1.near
nfvalidator1.near	nfvalidator1.near
nfvalidator2.near	nfvalidator2.near
foundation.near	baziliknear.poolv1.near
foundation.near	huobipool.poolv1.near
nfvalidator2.near	nfvalidator2.near
foundation.near	01node.poolv1.near
foundation.near	bisontrails.poolv1.near
foundation.near	buildlinks.poolv1.near
foundation.near	certusone.poolv1.near
foundation.near	cryptium.poolv1.near
foundation.near	dokiacapital.poolv1.near
foundation.near	dsrvlabs.poolv1.near
foundation.near	huobipool.poolv1.near
foundation.near	sparkpool.poolv1.near
foundation.near	staked.poolv1.near
foundation.near	zkv_staketosupportprivacy.poolv1.near
foundation.near	figment.poolv1.near
foundation.near	stakefish.poolv1.near
foundation.near	hashquark.poolv1.near
nfvalidator1.near	nfvalidator1.near
nfvalidator2.near	nfvalidator2.near
nfvalidator3.near	nfvalidator3.near
nfvalidator4.near	nfvalidator4.near
foundation.near	moonlet.poolv1.near
foundation.near	ideocolabventures.poolv1.near
foundation.near	bobby.poolv1.near
foundation.near	electric.poolv1.near
foundation.near	openshards.poolv1.near
foundation.near	johnsmith.poolv1.near
foundation.near	hb436_pool.poolv1.near
foundation.near	near8888.poolv1.near
foundation.near	okexpool.poolv1.near
foundation.near	stakin.poolv1.near
foundation.near	chorusone.poolv1.near
foundation.near	chorusone.poolv1.near
foundation.near	nodeasy.poolv1.near
foundation.near	astro-stakers.poolv1.near
foundation.near	dialecticstake.poolv1.near
foundation.near	kukulastake1.poolv1.near
foundation.near	anonymous.poolv1.near
foundation.near	stakefish.poolv1.near
foundation.near	stakefish.poolv1.near
foundation.near	fish.poolv1.near
foundation.near	stakin.poolv1.near
foundation.near	stakin.poolv1.near
foundation.near	moonlet.poolv1.near
foundation.near	jazza.poolv1.near
foundation.near	01node.poolv1.near
foundation.near	openshards.poolv1.near
foundation.near	fresh.poolv1.near
foundation.near	nodeasy.poolv1.near
foundation.near	anonymous.poolv1.near
foundation.near	masternode24.poolv1.near
foundation.near	inotel.poolv1.near
foundation.near	ideocolabventures.poolv1.near
foundation.near	near8888.poolv1.near
foundation.near	dialecticstake.poolv1.near
foundation.near	hb436_pool.poolv1.near
foundation.near	johnsmith.poolv1.near
foundation.near	bobby.poolv1.near
foundation.near	anonymous.poolv1.near
foundation.near	01node.poolv1.near
foundation.near	nfvalidator4.near
foundation.near	nfvalidator3.near
foundation.near	nfvalidator2.near
foundation.near	nfvalidator1.near
foundation.near	nfvalidator4.near
foundation.near	nfvalidator3.near
foundation.near	nfvalidator2.near
foundation.near	nfvalidator1.near
foundation.near	certusone.poolv1.near
foundation.near	anonymous.poolv1.near
foundation.near	buildlinks.poolv1.near
foundation.near	dokiacapital.poolv1.near
foundation.near	erm.poolv1.near
foundation.near	chorusone.poolv1.near
foundation.near	huobipool.poolv1.near
foundation.near	bisontrails.poolv1.near
foundation.near	figment.poolv1.near
foundation.near	staked.poolv1.near
foundation.near	sparkpool.poolv1.near
foundation.near	zkv_staketosupportprivacy.poolv1.near
foundation.near	dsrvlabs.poolv1.near
foundation.near	anonymous.poolv1.near
foundation.near	jazza.poolv1.near
foundation.near	cryptium.poolv1.near
foundation.near	hashquark.poolv1.near
foundation.near	chorusone.poolv1.near
foundation.near	cryptium.poolv1.near
foundation.near	bisontrails.poolv1.near
foundation.near	dokiacapital.poolv1.near
foundation.near	figment.poolv1.near
foundation.near	zavodil.poolv1.near
foundation.near	astro-stakers.poolv1.near
foundation.near	bobby.poolv1.near
foundation.near	dialecticstake.poolv1.near
foundation.near	hb436_pool.poolv1.near
foundation.near	johnsmith.poolv1.near
foundation.near	kukulastake1.poolv1.near
foundation.near	near8888.poolv1.near
foundation.near	staked.poolv1.near
foundation.near	bisontrails.poolv1.near
foundation.near	astro-stakers.poolv1.near
foundation.near	chorusone.poolv1.near
foundation.near	dokiacapital.poolv1.near
foundation.near	near8888.poolv1.near
foundation.near	figment.poolv1.near
foundation.near	staked.poolv1.near
foundation.near	zavodil.poolv1.near
foundation.near	cryptium.poolv1.near
foundation.near	bobby.poolv1.near
foundation.near	dialecticstake.poolv1.near
foundation.near	hb436_pool.poolv1.near
foundation.near	johnsmith.poolv1.near
foundation.near	kukulastake1.poolv1.near
nfendowment55.near	01node.poolv1.near
nfendowment55.near	01node.poolv1.near
nfendowment20.near	audit_one.poolv1.near
nfendowment21.near	audit_one.poolv1.near
nfendowment22.near	audit_one.poolv1.near
nfendowment23.near	lunanova.poolv1.near
nfendowment24.near	erm.poolv1.near
nfendowment25.near	electric.poolv1.near
nfendowment26.near	baziliknear.poolv1.near
nfendowment27.near	stakin.poolv1.near
nfendowment28.near	openshards.poolv1.near
nfendowment29.near	nodeasy.poolv1.near
nfendowment30.near	moonlet.poolv1.near
nfendowment31.near	masternode24.poolv1.near
nfendowment32.near	jazza.poolv1.near
nfendowment33.near	inotel.poolv1.near
nfendowment34.near	fresh.poolv1.near
nfendowment35.near	zkv_staketosupportprivacy.poolv1.near
nfendowment36.near	zkv_staketosupportprivacy.poolv1.near
nfendowment37.near	sparkpool.poolv1.near
nfendowment38.near	sparkpool.poolv1.near
nfendowment39.near	huobipool.poolv1.near
nfendowment40.near	huobipool.poolv1.near
nfendowment41.near	hashquark.poolv1.near
nfendowment42.near	hashquark.poolv1.near
nfendowment43.near	fish.poolv1.near
nfendowment44.near	fish.poolv1.near
nfendowment45.near	dsrvlabs.poolv1.near
nfendowment46.near	dsrvlabs.poolv1.near
nfendowment47.near	certusone.poolv1.near
nfendowment48.near	certusone.poolv1.near
nfendowment49.near	buildlinks.poolv1.near
nfendowment50.near	buildlinks.poolv1.near
nfendowment51.near	okexpool.poolv1.near
nfendowment52.near	okexpool.poolv1.near
nfendowment52.near	okexpool.poolv1.near
nfendowment53.near	everstake.poolv1.near
nfendowment53.near	everstake.poolv1.near
nfendowment54.near	01node.poolv1.near
nfendowment55.near	01node.poolv1.near
nfendowment20.near	audit_one.poolv1.near
nfendowment21.near	audit_one.poolv1.near
nfendowment22.near	audit_one.poolv1.near
nfendowment23.near	lunanova.poolv1.near
nfendowment24.near	erm.poolv1.near
nfendowment25.near	electric.poolv1.near
nfendowment26.near	baziliknear.poolv1.near
nfendowment27.near	stakin.poolv1.near
nfendowment28.near	openshards.poolv1.near
nfendowment29.near	nodeasy.poolv1.near
nfendowment30.near	moonlet.poolv1.near
nfendowment31.near	masternode24.poolv1.near
nfendowment32.near	jazza.poolv1.near
nfendowment33.near	inotel.poolv1.near
nfendowment34.near	fresh.poolv1.near
nfendowment35.near	zkv_staketosupportprivacy.poolv1.near
nfendowment36.near	zkv_staketosupportprivacy.poolv1.near
nfendowment37.near	sparkpool.poolv1.near
nfendowment38.near	sparkpool.poolv1.near
nfendowment39.near	huobipool.poolv1.near
nfendowment40.near	huobipool.poolv1.near
nfendowment41.near	hashquark.poolv1.near
nfendowment42.near	hashquark.poolv1.near
nfendowment43.near	fish.poolv1.near
nfendowment44.near	fish.poolv1.near
nfendowment45.near	dsrvlabs.poolv1.near
nfendowment46.near	dsrvlabs.poolv1.near
nfendowment47.near	certusone.poolv1.near
nfendowment48.near	certusone.poolv1.near
nfendowment49.near	buildlinks.poolv1.near
nfendowment50.near	buildlinks.poolv1.near
nfendowment51.near	okexpool.poolv1.near
nfendowment54.near	01node.poolv1.near
foundation.near	okexpool.poolv1.near
foundation.near	01node.poolv1.near
foundation.near	buildlinks.poolv1.near
foundation.near	certusone.poolv1.near
foundation.near	dsrvlabs.poolv1.near
foundation.near	fish.poolv1.near
foundation.near	hashquark.poolv1.near
foundation.near	huobipool.poolv1.near
foundation.near	sparkpool.poolv1.near
foundation.near	zkv_staketosupportprivacy.poolv1.near
foundation.near	fresh.poolv1.near
foundation.near	inotel.poolv1.near
foundation.near	jazza.poolv1.near
foundation.near	masternode24.poolv1.near
foundation.near	moonlet.poolv1.near
foundation.near	nodeasy.poolv1.near
foundation.near	openshards.poolv1.near
foundation.near	stakin.poolv1.near
foundation.near	baziliknear.poolv1.near
foundation.near	electric.poolv1.near
foundation.near	erm.poolv1.near
foundation.near	lunanova.poolv1.near
nfendowment19.near	ideocolabventures.poolv1.near
nfendowment19.near	ideocolabventures.poolv1.near
foundation.near	ideocolabventures.poolv1.near
foundation.near	01node.poolv1.near
foundation.near	certusone.poolv1.near
foundation.near	buildlinks.poolv1.near
foundation.near	baziliknear.poolv1.near
foundation.near	erm.poolv1.near
foundation.near	electric.poolv1.near
foundation.near	dsrvlabs.poolv1.near
foundation.near	fish.poolv1.near
foundation.near	fresh.poolv1.near
foundation.near	inotel.poolv1.near
foundation.near	ideocolabventures.poolv1.near
foundation.near	hashquark.poolv1.near
foundation.near	masternode24.poolv1.near
foundation.near	moonlet.poolv1.near
foundation.near	nodeasy.poolv1.near
foundation.near	jazza.poolv1.near
foundation.near	sparkpool.poolv1.near
foundation.near	zkv_staketosupportprivacy.poolv1.near
foundation.near	openshards.poolv1.near
foundation.near	huobipool.poolv1.near
foundation.near	lunanova.poolv1.near
foundation.near	stakin.poolv1.near
nfendowment43.near	fish.poolv1.near
foundation.near	okexpool.poolv1.near
nfendowment51.near	okexpool.poolv1.near
nfendowment52.near	okexpool.poolv1.near
nfendowment16.near	cryptotribe.poolv1.near
nfendowment17.near	cryptotribe.poolv1.near
nfendowment18.near	cryptotribe.poolv1.near
nfendowment16.near	cryptotribe.poolv1.near
nfendowment17.near	cryptotribe.poolv1.near
nfendowment18.near	cryptotribe.poolv1.near
nfendowment13.near	sweden.poolv1.near
nfendowment14.near	sweden.poolv1.near
nfendowment15.near	sweden.poolv1.near
nfendowment13.near	sweden.poolv1.near
nfendowment14.near	sweden.poolv1.near
nfendowment15.near	sweden.poolv1.near
nfendowment12.near	zkv_staketosupportprivacy.poolv1.near
nfendowment11.near	zkv_staketosupportprivacy.poolv1.near
nfendowment12.near	zkv_staketosupportprivacy.poolv1.near
nfendowment11.near	zkv_staketosupportprivacy.poolv1.near
nfendowment51.near	okexpool.poolv1.near
nfendowment52.near	okexpool.poolv1.near
nfendowment30.near	moonlet.poolv1.near
nfendowment08.near	p2p-org.poolv1.near
nfendowment09.near	p2p-org.poolv1.near
nfendowment10.near	p2p-org.poolv1.near
nfendowment08.near	p2p-org.poolv1.near
nfendowment09.near	p2p-org.poolv1.near
nfendowment10.near	p2p-org.poolv1.near
`;

const DELEGATION_BY_DELEGATOR_ACCOUNT_ID = {};
DELEGATION_HISTORY_RAW.split('\n').forEach((line) => {
  if (line.length === 0) {
    return;
  }
  const [delegatorAccountId, validatorAccountId] = line.split(/\s+/);
  if (!validatorAccountId.endsWith('poolv1.near')) {
    return;
  }
  if (typeof DELEGATION_BY_DELEGATOR_ACCOUNT_ID[delegatorAccountId] === 'undefined') {
    DELEGATION_BY_DELEGATOR_ACCOUNT_ID[delegatorAccountId] = new Set();
  }
  DELEGATION_BY_DELEGATOR_ACCOUNT_ID[delegatorAccountId].add(validatorAccountId);
})

function generateLockupAccountIdFromAccountId(accountId) {
  // copied from https://github.com/near/near-wallet/blob/f52a3b1a72b901d87ab2c9cee79770d697be2bd9/src/utils/wallet.js#L601
  return (
    sha256(Buffer.from(accountId)).substring(0, 40) +
    ".lockup.near"
  );
}

function parseJsonFromRawResponse (response) {
    return JSON.parse(Buffer.from(response).toString());
}

async function viewFunction(connection, contractAccountId, methodName, args, blockReference) {
  while (true) {
    try {
      const result = await connection.provider.sendJsonRpc(
        "query",
        {
          request_type: "call_function",
          account_id: contractAccountId,
          method_name: methodName,
          args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
          ...blockReference,
        }
      );
      return result.result && result.result.length > 0 && parseJsonFromRawResponse(Buffer.from(result.result));
    } catch (err) {
    }
  }
}

function yoctoToNEAR(yoctoAmount) {
  return yoctoAmount.substring(0, yoctoAmount.length - 24) || '0';
}

async function main() {
  // Initializing connection to the NEAR node.
  const keyStore = new nearAPI.keyStores.UnencryptedFileSystemKeyStore(
    "/home/username/.near-credentials/"
  );
  const near = await nearAPI.connect({
    deps: {
      keyStore,
    },
    nodeUrl: "https://archival-rpc.mainnet.near.org",
    networkId: "default"
  });

  const EPOCH_BLOCK_HEIGHTS_WITH_DATE = [];
  for (const epochBlockHeight of EPOCH_BLOCK_HEIGHTS) {
    console.log("Fetching block date for #", epochBlockHeight);
    EPOCH_BLOCK_HEIGHTS_WITH_DATE.push({
      blockHeight: epochBlockHeight,
      date: new Date((await near.connection.provider.block({ blockId: epochBlockHeight })).header.timestamp / 1000000),
    })
  }

  for (const [delegatorAccountId, validatorAccountIds] of Object.entries(DELEGATION_BY_DELEGATOR_ACCOUNT_ID)) {
    let nativeDelegatorAccountId;
    if (!delegatorAccountId.endsWith('.lockup.near') && delegatorAccountId !== 'foundation.near') {
      nativeDelegatorAccountId = generateLockupAccountIdFromAccountId(delegatorAccountId);
    } else {
      nativeDelegatorAccountId = delegatorAccountId
    }
    for (const validatorAccountId of validatorAccountIds) {
      for (const { blockHeight: epochBlockHeight, date } of EPOCH_BLOCK_HEIGHTS_WITH_DATE) {
        const totalBalance = yoctoToNEAR(await viewFunction(
          near.connection,
          validatorAccountId,
          "get_account_total_balance",
          { account_id: nativeDelegatorAccountId },
          { block_id: epochBlockHeight }
        ) || '0');
        console.log(`${delegatorAccountId},${validatorAccountId},${date.toISOString()},${epochBlockHeight},${totalBalance}`)
      }
    }
  }

}

main();
