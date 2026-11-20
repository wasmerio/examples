# scikit-learn text classifier on Wasmer

Serve a [scikit-learn](https://scikit-learn.org/) model as a web page and a JSON API. The template ships an SMS spam classifier (TF-IDF features + logistic regression) and shows the predicted label, the class probabilities and the words that pushed the prediction. Point it at your own CSV to train a different classifier.

## Demo

Live demo: <https://sklearn-classifier-template.wasmer.app>

Type or paste a message, or press **Try spam** or **Try ham**. The same model answers the API:

```bash
curl -X POST https://sklearn-classifier-template.wasmer.app/api/predict \
  -H 'Content-Type: application/json' \
  -d '{"text": "WINNER! Claim your free prize now"}'
```

```json
{
  "label": "spam",
  "probabilities": {"ham": 0.024, "spam": 0.976},
  "top_words": [{"word": "claim", "weight": 1.78}, {"word": "prize", "weight": 1.42}]
}
```

A missing, empty or non-string `text`, or one longer than 2,000 characters, returns `400` with `{"error": "..."}`.

## How it works

- `train.py` reads `data/sms_spam.csv` (columns `label,text`) and builds a scikit-learn `Pipeline` of `TfidfVectorizer` and `LogisticRegression`. Run on its own, it prints the accuracy on a stratified 20% hold-out split (about 0.99).
- `main.py` is a small Flask app. At startup it fits the pipeline on every row of the CSV, then serves `index.html` at `/` and handles `POST /api/predict`. The top words are the message's TF-IDF values multiplied by the model's coefficients for the predicted class.
- The page is built from the shared Wasmer starter components. `static/wasmer-starter-ui.js` is a generated copy of `_shared/starter-ui/wasmer-starter-ui.js`; refresh it from the repository root with `node scripts/sync-starter-ui.mjs python-sklearn-classifier/static/wasmer-starter-ui.js`.
- `requirements.txt` pins `scikit-learn==1.8.0`, the version Wasmer's Python package index provides, so local and Edge results match.
- `Anybuild` selects Python 3.13 and the `python main.py` start command. The repository-root `Anybuild.python-sklearn-classifier` provides the same configuration for monorepo builds with `--subdir python-sklearn-classifier`.

### Why train at startup

On Wasmer Edge, importing scikit-learn takes about 1.7 s of a cold start and fitting this dataset takes about 0.3 s, so the template trains on boot instead of committing a binary model. Changing the CSV is enough to change the model, and there is no pickle to keep in sync with the scikit-learn version.

For a larger dataset, where training takes more than about a second, save the fitted model and ship it instead:

```bash
.venv/bin/python train.py --save   # writes model.joblib
```

When `model.joblib` exists, `main.py` loads it with `joblib.load` (following scikit-learn's [model persistence guide](https://scikit-learn.org/stable/model_persistence.html)) instead of training, and refuses to load a file written by a different scikit-learn version. Remove `model.joblib` from `.gitignore` to deploy it, and only load model files you trust: unpickling can run arbitrary code.

No database, GPU, API key or persistent volume is needed.

## Running locally

Use Python 3.13:

```bash
cd python-sklearn-classifier
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
PORT=8080 .venv/bin/python main.py
```

Open <http://localhost:8080/>. Run the tests with `.venv/bin/pip install pytest && .venv/bin/python -m pytest tests`.

## Retraining on your own CSV

Prepare a UTF-8 CSV with a header row and two columns, `label` and `text`. Any number of labels works; with more than two, the API returns one probability per label.

```csv
label,text
positive,"Loved it, would come back"
negative,"Cold food and slow service"
```

Check how well it learns, then point the app at it:

```bash
.venv/bin/python train.py --data path/to/your.csv
DATA_PATH=path/to/your.csv .venv/bin/python main.py
```

To deploy it, replace `data/sms_spam.csv` with your file (or set the `DATA_PATH` environment variable on the app) and redeploy. Update the page text and example buttons in `index.html` to match your labels.

## Deploying to Wasmer

1. Import `https://github.com/wasmerio/examples` in Wasmer and set the root directory to `python-sklearn-classifier`, or upload the contents of this directory as a folder.
2. Keep the Python preset and start command `python main.py`.
3. Deploy and open the app URL.

With the Wasmer CLI, from this directory:

```bash
wasmer deploy --build-remote
```

## License and data

The template code is MIT licensed; see [LICENSE](LICENSE). `data/sms_spam.csv` is the [SMS Spam Collection](https://archive.ics.uci.edu/dataset/228/sms+spam+collection) by Tiago A. Almeida and José María Gómez Hidalgo, converted from tab-separated to CSV with no other changes, and distributed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Citation: Almeida, T.A., Gómez Hidalgo, J.M., Yamakami, A. *Contributions to the Study of SMS Spam Filtering: New Collection and Results*. ACM DocEng 2011. The messages are real SMS texts and may include informal or offensive language. 
