<div class="grid-container medium-10 medium-centered columns">
	<div class="grid-x grid-padding-x u-padding-top">
		<div class="small-10 medium-8 cell">
			<h1>Find an expert</h1>
		</div>
	</div>
</div>
<form class="c-form u-bg-grey u-padding-y" action="<?php echo $mgpath; ?>" method="post">
	<div class="grid-container medium-10 medium-centered columns">
        <div class="grid-x grid-padding-x align-bottom">
            <div class="cell small-12 medium-9">
                <label for="expert-search__query">Search</label>
                <input type="text" name="query" placeholder="Search for an expert" autocomplete="off" id="expert-search__query" value="<?php echo $safepost; ?>">
            </div>
            <div class="cell small-12 medium-3 hide-for-small-only">
                <button class="button heritage-green c-expert-search__button expanded">Search</button>
            </div>
        </div>
        <div class="grid-x grid-padding-x">
            <div class="cell small-12 show-for-small-only">
                <button type="submit" class="button c-expert-search__button expanded">Search</button>
            </div>
        </div>
    </div>

    <div class="grid-container medium-10 medium-centered columns">
        <div class="grid-x grid-padding-x">
            <div class="cell small-12 medium-12 expert-search-type" role="group" aria-label="search type">
                <p>Search by: 
				<label><input type="radio" name="searchtype" value="0" <?php echo(($searchtype !=="1" ? ' checked ': '')); ?>tabindex="0">topic </label>
				<label><input type="radio" name="searchtype" value="1" <?php echo(($searchtype==="1" ? ' checked ': '')); ?>tabindex="0">name</label>
				</p>
            </div>
        </div>
    </div>
</form>