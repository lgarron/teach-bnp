all: deploy open

.PHONY: deploy
deploy:
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		./ \
		towns.dreamhost.com:~/garron.net/dance/teach-bnp/
	echo "\nDone deploying. Go to https://garron.net/dance/teach-bnp/\n"

.PHONY: open
open:
	open "https://garron.net/dance/teach-bnp/"
